import React from 'react';
import { Home, Palmtree, Briefcase, Heart, Sparkles } from 'lucide-react';

interface BottomNavProps {
  currentScreen?: string;
  currentTab?: string;
  onNavigate?: (screen: string) => void;
  onTabChange?: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen = 'home',
  currentTab,
  onNavigate,
  onTabChange,
}) => {
  const activeKey = currentTab || currentScreen;

  const handleSelect = (id: string) => {
    if (onTabChange) {
      onTabChange(id);
    }
    if (onNavigate) {
      onNavigate(id);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'holidays', label: 'Holidays', icon: Palmtree },
    { id: 'myra', label: 'Make It Real', icon: Sparkles, isSpecial: true },
    { id: 'my_trips', label: 'My Trips', icon: Briefcase },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 shadow-lg max-w-xl mx-auto md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.id === activeKey ||
            (item.id === 'holidays' && activeKey === 'holiday_packages') ||
            (item.id === 'myra' && activeKey !== 'home' && activeKey !== 'holiday_packages' && activeKey !== 'holidays');

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                item.isSpecial
                  ? 'text-[#008CFF]'
                  : isActive
                  ? 'text-[#008CFF]'
                  : 'text-[#6B6B6B] hover:text-slate-900'
              }`}
            >
              {item.isSpecial ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#42B8F5] to-[#0065F5] text-white flex items-center justify-center -mt-3 shadow-md">
                  <Icon className="w-4 h-4" />
                </div>
              ) : (
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              )}
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
