import React, { useState, useRef } from 'react';
import { User, SmokingHabits, DrinkingHabits, MaritalStatus, WillingToRelocate, ChildrenPreference } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { CloseIcon } from './icons/CloseIcon';
import { COUNTRIES, STATES_BY_COUNTRY, CITIES_BY_STATE, MANUAL_ENTRY_VAL } from '../services/locationData';

interface OnboardingFlowProps {
  user: User;
  onComplete: (updatedUser: User) => void;
  onCancel?: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ user, onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<User>(user);
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualInputs, setManualInputs] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalSteps = 4;

  const handleNext = () => {
    // --- STEP 1 VALIDATION (Identity & Roots) ---
    if (step === 1) {
      if (!formData.name || formData.name.length < 2) {
        alert("Full Legal Name is required for the Global Registry.");
        return;
      }
      if (!formData.age || formData.age < 18 || formData.age > 99) {
        alert("Valid age (18+) is required for registry activation.");
        return;
      }
      if (!formData.residenceCountry || !formData.residenceCity || !formData.originCountry || !formData.originCity) {
        alert("Accurate location data is required for matching. Please complete residence and origin details.");
        return;
      }
    }

    // --- STEP 4 VALIDATION (Photo) ---
    if (step === 4 && (!formData.profileImageUrls || formData.profileImageUrls.length === 0)) {
      alert("A professional profile picture is mandatory for registry verification.");
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // --- FINAL DATA NORMALIZATION ---
      // This ensures your "Match Filters" in App.tsx work by syncing nested data to top-level fields
      const finalUser: User = {
        ...formData,
        city: formData.residenceCity,
        country: formData.residenceCountry,
        isVerified: false, // Default to false for new activations
        lastActive: new Date().toISOString()
      };
      onComplete(finalUser);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'residenceCountry') {
        setFormData(prev => ({ ...prev, residenceCountry: value, residenceState: '', residenceCity: '', country: value }));
        setManualInputs(p => ({ ...p, residenceState: '', residenceCity: '' }));
    } else if (name === 'residenceState') {
        setFormData(prev => ({ ...prev, residenceState: value, residenceCity: '' }));
        setManualInputs(p => ({ ...p, residenceCity: '' }));
    } else if (name === 'originCountry') {
        setFormData(prev => ({ ...prev, originCountry: value, originState: '', originCity: '' }));
        setManualInputs(p => ({ ...p, originState: '', originCity: '' }));
    } else if (name === 'originState') {
        setFormData(prev => ({ ...prev, originState: value, originCity: '' }));
        setManualInputs(p => ({ ...p, originCity: '' }));
    } else if (name === 'residenceCity') {
        setFormData(prev => ({ ...prev, residenceCity: value, city: value }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleManualTextInput = (field: string, value: string) => {
    setManualInputs(p => ({ ...p, [field]: value }));
    setFormData(p => ({ ...p, [field]: value }));
    if (field === 'residenceCity') setFormData(p => ({ ...p, city: value }));
    if (field === 'residenceCountry') setFormData(p => ({ ...p, country: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) setFormData({ ...formData, profileImageUrls: [result] });
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const inputClass = "w-full p-4 border border-gray-200 rounded-2xl bg-white text-black focus:ring-2 focus:ring-brand-primary focus:border-transparent focus:outline-none shadow-sm transition-all text-sm";
  const labelClass = "block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest";
  const sectionTitleClass = "text-xs font-black text-brand-primary uppercase tracking-widest border-b pb-2 mb-4 mt-6";

  const renderLocationGroup = (prefix: 'residence' | 'origin', title: string) => {
    const countryField = `${prefix}Country` as keyof User;
    const stateField = `${prefix}State` as keyof User;
    const cityField = `${prefix}City` as keyof User;

    const countryVal = formData[countryField] as string;
    const stateVal = formData[stateField] as string;
    const cityVal = formData[cityField] as string;

    const availableStates = STATES_BY_COUNTRY[countryVal] || [];
    const availableCities = CITIES_BY_STATE[stateVal] || [];

    const isStateManual = stateVal && availableStates.length > 0 && !availableStates.includes(stateVal);
    const isCityManual = cityVal && availableCities.length > 0 && !availableCities.includes(cityVal);
    
    const forceStateManual = countryVal && availableStates.length === 0;
    const forceCityManual = stateVal && availableCities.length === 0;

    return (
      <div className="space-y-4">
        <h3 className={sectionTitleClass}>{title}</h3>
        <div>
          <label className={labelClass}>Country</label>
          <select name={countryField} value={countryVal} onChange={handleChange} className={inputClass}>
            <option value="">Select Country</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {countryVal && (
          <div>
            <label className={labelClass}>State / Province</label>
            {forceStateManual ? (
               <input value={stateVal} onChange={(e) => handleManualTextInput(stateField, e.target.value)} className={inputClass} placeholder="Type your state/province" />
            ) : (
                <>
                    <select 
                      name={stateField} 
                      value={availableStates.includes(stateVal) ? stateVal : (stateVal ? MANUAL_ENTRY_VAL : '')} 
                      onChange={(e) => e.target.value === MANUAL_ENTRY_VAL ? handleManualTextInput(stateField, '') : handleChange(e)} 
                      className={inputClass}
                    >
                        <option value="">Select State</option>
                        {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
                        <option value={MANUAL_ENTRY_VAL}>Other / Manual Entry...</option>
                    </select>
                    {(isStateManual || stateVal === MANUAL_ENTRY_VAL) && (
                         <input value={stateVal === MANUAL_ENTRY_VAL ? '' : stateVal} onChange={(e) => handleManualTextInput(stateField, e.target.value)} className={`${inputClass} mt-2 border-brand-accent`} placeholder="Enter state name" autoFocus />
                    )}
                </>
            )}
          </div>
        )}

        {(stateVal || forceStateManual) && (
          <div>
            <label className={labelClass}>City / Town</label>
            {forceCityManual ? (
                <input value={cityVal} onChange={(e) => handleManualTextInput(cityField, e.target.value)} className={inputClass} placeholder="Type your city/town" />
            ) : (
                <>
                    <select 
                      name={cityField} 
                      value={availableCities.includes(cityVal) ? cityVal : (cityVal ? MANUAL_ENTRY_VAL : '')} 
                      onChange={(e) => e.target.value === MANUAL_ENTRY_VAL ? handleManualTextInput(cityField, '') : handleChange(e)} 
                      className={inputClass}
                    >
                        <option value="">Select City</option>
                        {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value={MANUAL_ENTRY_VAL}>Other / Manual Entry...</option>
                    </select>
                    {(isCityManual || cityVal === MANUAL_ENTRY_VAL) && (
                         <input value={cityVal === MANUAL_ENTRY_VAL ? '' : cityVal} onChange={(e) => handleManualTextInput(cityField, e.target.value)} className={`${inputClass} mt-2 border-brand-accent`} placeholder="Enter city/town name" autoFocus />
                    )}
                </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 pb-32 relative font-sans animate-fade-in">
      {/* HEADER SECTION */}
      <div className="mb-10">
        <div className="flex justify-between items-start mb-3">
            <div>
                <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">Knot Global Registry</h4>
                <h2 className="text-2xl font-black text-brand-dark">
                  {step === 1 && 'Identity & Roots'}
                  {step === 2 && 'Lifestyle & Values'}
                  {step === 3 && 'Commitment'}
                  {step === 4 && 'First Impressions'}
                </h2>
            </div>
            <div className="flex flex-col items-end gap-2">
                <button onClick={onCancel} className="p-1.5 text-gray-300 hover:text-brand-primary hover:bg-gray-50 rounded-full transition-all">
                  <CloseIcon className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{step}/{totalSteps}</span>
            </div>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-primary transition-all duration-700 ease-in-out" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        </div>
      </div>

      <div className="flex-1 animate-slide-in">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Full Legal Name</label>
              <input name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="Enter your full name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className={labelClass}>Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputClass} placeholder="18" />
               </div>
               <div>
                  <label className={labelClass}>Occupation</label>
                  <input name="occupation" value={formData.occupation} onChange={handleChange} className={inputClass} placeholder="e.g. Architect" />
               </div>
            </div>

            {renderLocationGroup('residence', 'Current Residence')}
            {renderLocationGroup('origin', 'Heritage & Origin')}
            
            <div className="animate-fade-in">
                <label className={labelClass}>Cultural / Ethnic Identity</label>
                <input name="culturalBackground" value={formData.culturalBackground} onChange={handleChange} className={inputClass} placeholder="e.g. Yoruba, Punjabi, Ashkenazi" />
            </div>

            <div className="pt-4">
                <label className={labelClass}>Marriage-Oriented Bio</label>
                <textarea name="bio" rows={4} value={formData.bio} onChange={handleChange} className={inputClass} placeholder="What are you looking for in a life partner?" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <p className="text-gray-500 text-sm leading-relaxed">Honesty about lifestyle ensures a stable registry match.</p>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Religion / Faith</label>
                <input name="religion" value={formData.religion} onChange={handleChange} className={inputClass} placeholder="e.g. Christian, Muslim, Secular" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Smoking</label>
                  <select name="smoking" value={formData.smoking} onChange={handleChange} className={inputClass}>
                    {Object.values(SmokingHabits).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Drinking</label>
                  <select name="drinking" value={formData.drinking} onChange={handleChange} className={inputClass}>
                    {Object.values(DrinkingHabits).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <p className="text-gray-500 text-sm leading-relaxed">Knot matches members based on their commitment timeline.</p>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Ideal Marriage Timeline</label>
                <select name="marriageTimeline" value={formData.marriageTimeline} onChange={handleChange} className={inputClass}>
                    <option value="ASAP">As soon as I find the one</option>
                    <option value="1-2 years">Within 1-2 years</option>
                    <option value="3+ years">3+ years</option>
                    <option value="Not sure">Not sure yet</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Future Children</label>
                <select name="childrenPreference" value={formData.childrenPreference} onChange={handleChange} className={inputClass}>
                  {Object.values(ChildrenPreference).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Relocation Willingness</label>
                <select name="willingToRelocate" value={formData.willingToRelocate} onChange={handleChange} className={inputClass}>
                  {Object.values(WillingToRelocate).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 text-center px-4">
            <div className="animate-fade-in">
                <div className="flex justify-center mb-2">
                    <SparklesIcon className="w-6 h-6 text-brand-accent animate-pulse" />
                </div>
                <h3 className="text-3xl font-serif text-brand-primary mb-2">First Impressions</h3>
                <p className="text-gray-500 text-sm leading-relaxed px-6">High-quality portraits are required for Global Registry visibility.</p>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <div onClick={() => fileInputRef.current?.click()} className="relative inline-block w-full max-w-[280px] aspect-[4/5] mx-auto cursor-pointer group animate-scale-in">
                <div className={`w-full h-full rounded-[2.5rem] border-4 border-dashed ${formData.profileImageUrls.length > 0 ? 'border-brand-primary border-solid' : 'border-gray-200'} overflow-hidden bg-gray-50 flex items-center justify-center shadow-2xl transition-all hover:bg-brand-light active:scale-[0.98]`}>
                    {formData.profileImageUrls.length > 0 ? (
                         <img src={formData.profileImageUrls[0]} className="w-full h-full object-cover animate-fade-in" alt="Profile" />
                    ) : (
                        <div className="text-center p-8">
                            {isProcessing ? (
                                <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                            ) : (
                                <>
                                    <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <PlusIcon className="h-10 w-10 text-brand-primary" />
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-relaxed px-4">Tap to upload registry photo</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-white flex items-center gap-4 z-30 border-t border-gray-50">
        {step > 1 && <button onClick={handlePrev} className="px-8 py-4 rounded-2xl border border-gray-100 text-gray-400 font-bold hover:bg-gray-50 transition-all">Back</button>}
        <button onClick={handleNext} className="flex-1 bg-brand-primary text-white font-black py-4 rounded-2xl text-lg hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/30 active:scale-95">
            {step === totalSteps ? 'Activate Registry' : 'Continue'}
        </button>
      </div>

      <style>{`
        .animate-slide-in { animation: slideIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-scale-in { animation: scaleIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default OnboardingFlow;