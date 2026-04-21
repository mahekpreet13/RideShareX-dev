import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          
          {/* Left Side: Form/Text */}
          <div className="w-full lg:w-1/2 flex flex-col items-start relative z-10">
            <h1 className="text-5xl md:text-[4.5rem] font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              Request a ride for now or later
            </h1>
            
            <div className="flex items-center gap-2 mb-8 bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-semibold border border-green-200">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
              <span>Up to 50% off your first 5 rides. T&Cs apply*</span>
            </div>

            <div className="w-full max-w-md bg-card rounded-2xl shadow-lg border border-border p-6 space-y-4 relative">
              <div className="absolute left-[2.1rem] top-[4.8rem] bottom-[6.5rem] w-0.5 bg-foreground/20 z-0"></div>

              <div className="relative z-10">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-foreground shadow-[0_0_0_4px_var(--card)]"></div>
                <input 
                  type="text" 
                  placeholder="Pickup location" 
                  className="w-full pl-12 pr-4 py-3.5 bg-secondary border border-transparent rounded-lg focus:bg-background focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-all text-foreground text-base cursor-text hover:bg-secondary/80"
                  onClick={() => navigate('/login')}
                  readOnly
                />
              </div>
              
              <div className="relative z-10">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-sm bg-foreground shadow-[0_0_0_4px_var(--card)]"></div>
                <input 
                  type="text" 
                  placeholder="Dropoff location" 
                  className="w-full pl-12 pr-4 py-3.5 bg-secondary border border-transparent rounded-lg focus:bg-background focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-all text-foreground text-base cursor-text hover:bg-secondary/80"
                  onClick={() => navigate('/login')}
                  readOnly
                />
              </div>

              <button 
                onClick={() => navigate('/login')}
                className="w-full py-3.5 mt-2 bg-foreground text-background text-lg font-medium rounded-lg hover:bg-foreground/90 transition-colors"
              >
                See prices
              </button>
            </div>
          </div>

          {/* Right Side: Square Image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-full aspect-square max-w-[550px] rounded-[2rem] overflow-hidden shadow-2xl">
              <img 
                src="/hero-bg.jpg" 
                alt="Request a ride" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop";
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Features Section */}
      <div className="bg-secondary/30 py-24 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">Explore what you can do with RideShareX</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {/* Feature 1 */}
            <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => navigate('/login')}>
              <div className="h-48 overflow-hidden bg-muted relative">
                <img src="/feature-safety.jpg" alt="Safety" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" 
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop"; }} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                  Safety First
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Every ride is tracked, and every driver is vetted to ensure you reach your destination safely.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => navigate('/login')}>
              <div className="h-48 overflow-hidden bg-muted relative">
                <img src="/feature-fast.jpg" alt="Fast Pickups" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1469980098053-382eb10ba017?q=80&w=800&auto=format&fit=crop"; }} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                  Fast Pickups
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">With our optimized routing algorithm, the nearest driver is always just a few minutes away.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => navigate('/login')}>
              <div className="h-48 overflow-hidden bg-muted relative">
                <img src="/feature-affordable.jpg" alt="Affordable" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1620241608701-94ef138c7ec9?q=80&w=800&auto=format&fit=crop"; }} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                  Affordable Rides
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Split the cost with others going your way or enjoy competitive solo fares anytime.</p>
              </div>
            </div>
          </div>

          {/* Driver CTA Section */}
          <div className="flex flex-col lg:flex-row bg-card rounded-[2rem] overflow-hidden shadow-xl border border-border relative">
            <div className="w-full lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center z-10 bg-card">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">Drive when you want, make what you need</h2>
              <p className="text-lg text-muted-foreground mb-10">
                Make money on your schedule with deliveries or rides—or both. You can use your own car or choose a rental through RideShareX.
              </p>
              <button 
                onClick={() => navigate('/register')}
                className="w-max px-8 py-4 bg-foreground text-background text-lg font-medium rounded-lg hover:bg-foreground/90 transition-colors"
              >
                Get started
              </button>
            </div>
            <div className="w-full lg:w-1/2 h-[400px] lg:h-auto bg-muted relative">
              <div className="absolute inset-0 bg-gradient-to-r from-card to-transparent w-24 z-10 hidden lg:block"></div>
              <img src="/driver-cta.jpg" alt="Drive with us" className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000&auto=format&fit=crop"; }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
