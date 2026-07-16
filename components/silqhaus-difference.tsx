import React from 'react';
import { Check, Cpu, Key, Hotel, Wifi, Shield } from 'lucide-react';

const features = [
  {
    icon: Hotel,
    title: 'Only the top 1% of homes',
    description: 'We select homes in the most beautiful destinations and pour our hearts into making them magical so you can leave your stress at the door.'
  },
  {
    icon: Wifi,
    title: 'Hotel-grade amenities',
    description: 'From workstations with super fast WiFi to gyms, pools, and saunas, our locations are set up for you to effortlessly blend work and play.'
  },
  {
    icon: Check,
    title: '24/7 Concierge service',
    description: 'Our text-based Concierge is always available to help make your trip the best ever – from house questions to activity recommendations and more.'
  },
  {
    icon: Shield,
    title: 'Inspiring and stunning views',
    description: 'Every Silqhaus is located in an incredible setting with stunning views that will have you feeling inspired and refreshed in no time.'
  },
  {
    icon: Hotel,
    title: 'Meticulous cleaning',
    description: 'Our cleaning teams are meticulous about quality. We won\'t leave you a list of chores at check out either.'
  },
  {
    icon: Key,
    title: 'Safety and security',
    description: 'All of the Silqhaus locations on our platform are hand-picked by us and managed to our incredibly high, industry-leading safety standards.'
  }
];

export default function SilqhausDifference() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="centered-section mb-16">
          <h2 className="text-5xl font-gilroy font-bold text-charcoal mb-6">IT'S A VACATION HOME, BUT BETTER</h2>
          <h3 className="text-3xl font-semibold text-charcoal mb-8">The Silqhaus Difference</h3>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Silqhaus is different because we combine the quality of a luxury hotel with the comfort of a private vacation home. 
            Only the top 1% of vacation homes are available on Silqhaus.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-left">
                <div className="mb-6">
                  <Icon className="w-8 h-8 text-silqhaus mb-4" />
                </div>
                <h4 className="text-xl font-semibold text-charcoal mb-4">{feature.title}</h4>
                <p className="text-gray-600 text-base leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
