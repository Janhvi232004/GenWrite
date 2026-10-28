import ParticleField from '@/components/ParticleField';
import FloatingShapes from '@/components/FloatingShapes';

/**
 * Fixed full-screen background: aurora gradients + dotted grid +
 * particle network + floating shapes. Sits behind all page content.
 */
export default function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />
      <div className="dot-grid absolute inset-0" />
      <ParticleField />
      <FloatingShapes />
    </div>
  );
}
