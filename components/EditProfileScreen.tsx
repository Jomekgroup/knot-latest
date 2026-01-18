
import React, { useState } from 'react';
import { User, SmokingHabits, DrinkingHabits, MaritalStatus, WillingToRelocate, ChildrenPreference } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { COUNTRIES, STATES_BY_COUNTRY, CITIES_BY_STATE, MANUAL_ENTRY_VAL } from '../services/locationData';

interface EditProfileScreenProps {
  user: User;
  onBack: () => void;
  onSave: (updatedUser: User) => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ user, onBack, onSave }) => {
  const [formData, setFormData] = useState<User>(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'residenceCountry') {
        setFormData(prev => ({ ...prev, residenceCountry: value, residenceState: '', residenceCity: '', country: value }));
    } else if (name === 'residenceState') {
        setFormData(prev => ({ ...prev, residenceState: value, residenceCity: '' }));
    } else if (name === 'originCountry') {
        setFormData(prev => ({ ...prev, originCountry: value, originState: '', originCity: '' }));
    } else if (name === 'originState') {
        setFormData(prev => ({ ...prev, originState: value, originCity: '' }));
    } else if (name === 'residenceCity') {
        setFormData(prev => ({ ...prev, residenceCity: value, city: value }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleManualTextInput = (field: string, value: string) => {
    setFormData(p => ({ ...p, [field]: value }));
    if (field === 'residenceCity') setFormData(p => ({ ...p, city: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };
  
  const inputClass = "w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-black focus:bg-white focus:ring-2 focus:ring-brand-secondary focus:outline-none text-sm";
  const labelClass = "block text-[10px] font-black text-gray-400 mb-1 uppercase tracking-widest";
  const sectionClass = "p-4 bg-white rounded-lg shadow-sm border border-gray-200";

  const renderLocationInputs = (prefix: 'residence' | 'origin', sectionTitle: string) => {
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
        <div className={sectionClass}>
          <h2 className="text-sm font-black mb-4 text-brand-primary uppercase tracking-widest border-b pb-1">{sectionTitle}</h2>
          <div className="space-y-4">
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
                    <input 
                      value={stateVal} 
                      onChange={(e) => handleManualTextInput(stateField, e.target.value)} 
                      className={inputClass} 
                      placeholder="Type state name" 
                    />
                ) : (
                    <>
                        <select 
                            name={stateField} 
                            value={availableStates.includes(stateVal) ? stateVal : (stateVal ? MANUAL_ENTRY_VAL : '')} 
                            onChange={(e) => {
                                if (e.target.value === MANUAL_ENTRY_VAL) {
                                    handleManualTextInput(stateField, '');
                                } else {
                                    handleChange(e);
                                }
                            }} 
                            className={inputClass}
                        >
                            <option value="">Select State</option>
                            {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
                            <option value={MANUAL_ENTRY_VAL}>Other / Manual...</option>
                        </select>
                        {(isStateManual || stateVal === MANUAL_ENTRY_VAL) && (
                            <input 
                                value={stateVal === MANUAL_ENTRY_VAL ? '' : stateVal} 
                                onChange={(e) => handleManualTextInput(stateField, e.target.value)} 
                                className={`${inputClass} mt-2 border-brand-accent`}
                                placeholder="Enter state name" 
                            />
                        )}
                    </>
                )}
              </div>
            )}

            {(stateVal || forceStateManual) && (
              <div>
                <label className={labelClass}>City / Town</label>
                {forceCityManual ? (
                    <input 
                      value={cityVal} 
                      onChange={(e) => handleManualTextInput(cityField, e.target.value)} 
                      className={inputClass} 
                      placeholder="Type city name" 
                    />
                ) : (
                    <>
                        <select 
                            name={cityField} 
                            value={availableCities.includes(cityVal) ? cityVal : (cityVal ? MANUAL_ENTRY_VAL : '')} 
                            onChange={(e) => {
                                if (e.target.value === MANUAL_ENTRY_VAL) {
                                    handleManualTextInput(cityField, '');
                                } else {
                                    handleChange(e);
                                }
                            }} 
                            className={inputClass}
                        >
                            <option value="">Select City</option>
                            {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                            <option value={MANUAL_ENTRY_VAL}>Other / Manual...</option>
                        </select>
                        {(isCityManual || cityVal === MANUAL_ENTRY_VAL) && (
                            <input 
                                value={cityVal === MANUAL_ENTRY_VAL ? '' : cityVal} 
                                onChange={(e) => handleManualTextInput(cityField, e.target.value)} 
                                className={`${inputClass} mt-2 border-brand-accent`}
                                placeholder="Enter city name" 
                            />
                        )}
                    </>
                )}
              </div>
            )}

            {prefix === 'origin' && (
                <div className="pt-2 animate-fade-in">
                    <label className={labelClass}>Cultural / Ethnic Identity</label>
                    <input 
                        name="culturalBackground" 
                        value={formData.culturalBackground} 
                        onChange={handleChange} 
                        className={inputClass} 
                        placeholder="e.g. Yoruba, Punjabi, Ashkenazi, etc." 
                    />
                </div>
            )}
          </div>
        </div>
    );
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-brand-dark">Edit Registry</h1>
        <button onClick={onBack} className="p-1 rounded-full text-gray-400 hover:bg-gray-100">
          <CloseIcon className="w-6 h-6" />
        </button>
      </header>
      
      <main className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
        <div className={sectionClass}>
          <h2 className="text-sm font-black mb-4 text-brand-primary uppercase tracking-widest border-b pb-1">Identity</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Name</label>
              <input name="name" type="text" value={formData.name} onChange={handleChange} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Age</label>
                <input name="age" type="number" value={formData.age} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Marital Status</label>
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className={inputClass}>
                    {Object.values(MaritalStatus).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {renderLocationInputs('residence', 'Current Residence')}
        {renderLocationInputs('origin', 'Heritage & Roots')}

        <div className={sectionClass}>
          <h2 className="text-sm font-black mb-4 text-brand-primary uppercase tracking-widest border-b pb-1">Bio & Lifestyle</h2>
          <div className="space-y-4">
             <div>
              <label className={labelClass}>Occupation</label>
              <input name="occupation" type="text" value={formData.occupation} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Registry Bio</label>
              <textarea name="bio" rows={4} value={formData.bio} onChange={handleChange} className={inputClass} />
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
      </main>

      <footer className="p-4 bg-white border-t border-gray-200 sticky bottom-0">
        <button onClick={handleSave} className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-brand-secondary transition-colors shadow-lg">
          Save Registry Updates
        </button>
      </footer>
    </div>
  );
};

export default EditProfileScreen;
