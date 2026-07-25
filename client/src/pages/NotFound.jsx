import React from 'react';
import { Link } from 'react-router-dom';
import PixelBlast from '../components/PixelBlast';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-app text-primary relative overflow-hidden flex items-center justify-center">
      {/* Background Pixel Blast */}
      <div className="fixed inset-0 z-0 opacity-60">
        <PixelBlast
          variant="circle"
          pixelSize={8}
          color="#ef4444"
          patternScale={3}
          patternDensity={1.6}
          pixelSizeJitter={0.25}
          transparent={true}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-xl px-4">
        <div className="macos-glass p-10 text-center">
          <p className="text-accent text-sm uppercase tracking-[0.2em] mb-3">Navigation Error</p>
          <h1 className="text-display font-black mb-3">404</h1>
          <p className="text-secondary text-lg mb-6">You have wandered into the void. This route does not exist.</p>
          <Link to="/" className="btn-primary inline-block px-6">
            Return to Safety
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

