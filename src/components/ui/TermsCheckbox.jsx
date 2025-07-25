import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const TermsCheckbox = ({ isChecked, onCheck, required = true }) => {
    return (
        <div className="space-y-3">
            <div className="flex items-start space-x-3">
                <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={isChecked}
                    onChange={(e) => onCheck(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    required={required}
                />
                <label htmlFor="terms-checkbox" className="text-sm text-gray-700 leading-relaxed">
                    I agree to the{" "}
                    <Link 
                        to="/terms" 
                        className="text-emerald-600 hover:text-emerald-700 underline inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Terms and Conditions
                        <ExternalLink className="h-3 w-3" />
                    </Link>
                    {" "}and{" "}
                    <Link 
                        to="/privacy" 
                        className="text-emerald-600 hover:text-emerald-700 underline inline-flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Privacy Policy
                        <ExternalLink className="h-3 w-3" />
                    </Link>
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            </div>
            
    
        </div>
    );
};

export default TermsCheckbox;
