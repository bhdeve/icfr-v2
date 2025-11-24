/**
 * Footer Component
 * Displays "هذه المنصة مدعومة من أثرنا" across all pages
 */

import React from 'react';

export function Footer() {
  return (
    <footer className="mt-auto py-4 px-6 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto">
        <p className="text-center text-gray-600" style={{ fontSize: '13px' }}>
          هذه المنصة مدعومة من أثرنا
        </p>
      </div>
    </footer>
  );
}
