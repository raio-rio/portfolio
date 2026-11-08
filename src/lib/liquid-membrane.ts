/**
 * Procedural liquid membrane for the hero glass disc.
 *
 * The disc is drawn as a sampled SVG path. Every sample sits on a circle of
 * radius 1 at rest; the typography raises a local, Gaussian-shaped swell in the
 * rim as it approaches and passes through it, with the surrounding surface
 * lifting in response. Everything here is a pure function of the
 * current geometry and scroll progress, so scrubbing backwards replays the
 * same surface exactly.
 */

const TAU = Math.PI * 2;

/** Fraction of the resting diameter added around the disc for the membrane box. */
export const MEMBRANE_BOX_PAD = 0.2;
/** The membrane box is the resting diameter plus padding on both sides. */
export const MEMBRANE_BOX_SCALE = 1 + MEMBRANE_BOX_PAD * 2;
/** Resting radius in objectBoundingBox units of the padded membrane box. */
export const MEMBRANE_RADIUS = 0.5 / MEMBRANE_BOX_SCALE;

/** Smooth 0..1 ramp with zero first derivative at both ends. */
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/** Shortest signed angular distance, in [-PI, PI]. */
const wrapAngle = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));

export type MembraneCircle = {
  x: number;
  y: number;
  radius: number;
};

export type MembraneRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type MembraneContact = {
  /** Direction from the disc centre to the current contact / nearest point. */
  angle: number;
  /** Angular width of the rim currently covered by the text, in radians. */
  span: number;
  /** Distance from centre to the text's nearest point, in disc radii. */
  proximity: number;
  /** proximity - 1. Negative while the text is still inside the disc. */
  clearance: number;
  /** True while the rim actually passes through the text rectangle. */
  touching: boolean;
};

/**
 * Finds where the moving text currently meets the resting rim.
 *
 * A rectangle and a circle intersect in at most one contiguous arc, so we
 * sample the resting rim and keep the samples inside the text box. Their
 * circular mean gives the contact direction and their spread gives the width
 * of the surface the letters are stretching. When the text is still fully
 * inside, the nearest point of the rectangle is used as the direction the
 * membrane is about to be pulled toward.
 */
export const measureMembraneContact = (
  rect: MembraneRect,
  circle: MembraneCircle,
  samples = 96,
): MembraneContact => {
  const nearestX = Math.max(rect.left, Math.min(circle.x, rect.right));
  const nearestY = Math.max(rect.top, Math.min(circle.y, rect.bottom));
  const distance = Math.hypot(nearestX - circle.x, nearestY - circle.y);
  const proximity = distance / circle.radius;
  const clearance = proximity - 1;
  const nearestAngle = Math.atan2(nearestY - circle.y, nearestX - circle.x);

  let sumX = 0;
  let sumY = 0;
  let hits = 0;

  for (let index = 0; index < samples; index += 1) {
    const angle = (index / samples) * TAU - Math.PI;
    const x = circle.x + Math.cos(angle) * circle.radius;
    const y = circle.y + Math.sin(angle) * circle.radius;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) continue;
    sumX += Math.cos(angle);
    sumY += Math.sin(angle);
    hits += 1;
  }

  if (!hits) {
    return { angle: nearestAngle, span: 0, proximity, clearance, touching: false };
  }

  const angle = Math.atan2(sumY, sumX);
  let maxDeviation = 0;
  for (let index = 0; index < samples; index += 1) {
    const sample = (index / samples) * TAU - Math.PI;
    const x = circle.x + Math.cos(sample) * circle.radius;
    const y = circle.y + Math.sin(sample) * circle.radius;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) continue;
    maxDeviation = Math.max(maxDeviation, Math.abs(wrapAngle(sample - angle)));
  }

  return {
    angle,
    span: Math.min(Math.PI, maxDeviation * 2),
    proximity,
    clearance,
    touching: true,
  };
};

export type MembraneMotion = {
  /** Live contact direction, in radians. */
  angle: number;
  /** Frozen centre of the ripple, where the rio crossed the rim. */
  rippleAngle: number;
  /** Width of the arc covered by the text, in radians. */
  span: number;
  /** 0..1 tension while the text approaches / presses into the rim. */
  tension: number;
  /** 0..1 how far through the break-through we are. */
  release: number;
  /** Short outward pulse right after the swell lets go. */
  snap: number;
  /** 0..1 envelope for the travelling ripple. */
  ripple: number;
  /** Scroll-derived phase; no clocks, so it reverses with the scroll. */
  phase: number;
  /** Angular width of the swollen patch. */
  width: number;
};

/** Peak radial deformation, as a fraction of the resting radius. */
const AMPLITUDE = 0.17;
/** Radians of ripple phase per disc-radius the text travels past the rim. */
const RIPPLE_PHASE_RATE = 6;
/** How quickly the ripple envelope fades once the text has broken through. */
const RIPPLE_DECAY = 0.8;

export type MembraneRippleState = {
  /** 0..1 envelope for the post-release wave. */
  amplitude: number;
  /** Phase in radians; advancing this makes the wave travel around the rim. */
  phase: number;
  /** Centre of the wave, frozen where the rio crossed the rim. */
  angle: number;
};

/**
 * Maps geometry + scroll progress to the membrane's motion state.
 *
 * `clearance` is negative while the text is inside the disc and positive once
 * every part of it has crossed the rim. The optional `rippleState` lets the
 * caller drive the post-release wave on its own slow clock while the build-up
 * and release still follow the scroll.
 */
export const membraneMotion = (
  contact: MembraneContact,
  progress: number,
  rippleState?: MembraneRippleState,
): MembraneMotion => {
  // Keep the resting circle exact above the fold, even if a restored scroll
  // position leaves slightly stale geometry for a frame.
  const gate = smoothstep(0, 0.008, progress);

  // Tension grows while the nearest part of the wordmark closes the last
  // ~60% of the distance to the rim. It plateaus just before contact, which
  // gives the brief resistance before the break-through.
  const approach = smoothstep(-0.62, -0.01, contact.clearance);
  const release = smoothstep(0, 0.085, contact.clearance);
  const tension = approach * (1 - release) * gate;

  // An outward pulse once the swell releases; it decays within a small
  // fraction of the disc radius.
  const snap = release * Math.exp(-Math.pow(Math.max(0, contact.clearance) / 0.1, 2)) * gate;

  // The ripple can be driven either by the scroll-derived clearance (default)
  // or by an explicit time-based state from the renderer.
  const ripple = rippleState
    ? rippleState.amplitude * gate
    : release * Math.exp(-RIPPLE_DECAY * Math.max(0, contact.clearance - 0.02)) * gate;
  const phase = rippleState
    ? rippleState.phase
    : Math.max(0, contact.clearance) * RIPPLE_PHASE_RATE;
  const rippleAngle = rippleState ? rippleState.angle : contact.angle;

  // The swell starts wide enough to wrap the letters and tightens as the
  // surface tension rises right before the release.
  const width = 0.24 + 0.12 * (1 - tension) + Math.min(contact.span, 1) * 0.22;

  return { angle: contact.angle, rippleAngle, span: contact.span, tension, release, snap, ripple, phase, width };
};

/**
 * Radial displacement (in disc radii) for one angle.
 *
 * A wide Gaussian swell pulls the rim toward the text; the damped cosine is the
 * ripple that travels around the rim after the release.
 */
export const membraneDisplacement = (angle: number, motion: MembraneMotion) => {
  const delta = wrapAngle(angle - motion.angle);
  const width = motion.width;
  const core = Math.exp(-(delta * delta) / (2 * width * width));

  const localPull = motion.tension * core;
  const localSnap = 0.4 * motion.snap * core;

  // The wave keeps its own centre so it stays where the rio crossed the rim.
  const waveDelta = wrapAngle(angle - motion.rippleAngle);
  const rippleMask = Math.exp(-Math.abs(waveDelta) * 0.25);
  const wave = Math.cos(6 * waveDelta - motion.phase) * rippleMask;
  const breathe = Math.cos(motion.phase * 0.7);
  const ripple = motion.ripple * (0.55 * wave + 0.06 * breathe);

  // Never let the surface pull inside the resting circle: that exposes the
  // page behind the glass as a bright crescent while the ripple passes.
  return Math.max(0, AMPLITUDE * (localPull + localSnap + ripple));
};

export type MembraneShape = {
  /** Path in objectBoundingBox units, 0..1. */
  clip: string;
  /** Largest radial displacement used, useful for debugging. */
  offset: number;
};

/**
 * Samples the membrane once and returns the clip path used by the glass.
 */
export const buildMembraneShape = (
  motion: MembraneMotion | null = null,
  samples = 144,
): MembraneShape => {
  const clip: string[] = [];
  let offset = 0;

  for (let index = 0; index < samples; index += 1) {
    const angle = (index / samples) * TAU - Math.PI / 2;
    const displacement = motion ? membraneDisplacement(angle, motion) : 0;
    offset = Math.max(offset, Math.abs(displacement));

    const radius = MEMBRANE_RADIUS * (1 + displacement);
    const x = 0.5 + Math.cos(angle) * radius;
    const y = 0.5 + Math.sin(angle) * radius;

    clip.push(`${index === 0 ? 'M' : 'L'}${x.toFixed(5)} ${y.toFixed(5)}`);
  }

  clip.push('Z');

  return { clip: clip.join(''), offset };
};
