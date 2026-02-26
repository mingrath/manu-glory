import styles from "./particles.module.css";

const PARTICLE_COUNT = 12;

// Pre-computed random values to avoid hydration mismatch
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  left: `${(i * 8.33) % 100}%`,
  top: `${(i * 7.14 + 10) % 100}%`,
  delay: `${i * 0.67}s`,
  duration: `${6 + (i % 5) * 1.6}s`,
}));

export function Particles() {
  return (
    <div className={styles.container} aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className={styles.particle}
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}
