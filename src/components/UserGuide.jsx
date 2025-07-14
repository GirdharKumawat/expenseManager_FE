import React, { useState } from 'react';
import { 
    Home, 
    Users, 
    BarChart2, 
    User, 
    Plus, 
    Calculator,
    TrendingUp,
    TrendingDown,
    UtensilsCrossed,
    Car,
    Music,
    Lightbulb,
    ShoppingBag,
    Stethoscope,
    ChevronRight,
    ArrowRight,
    CreditCard,
    Banknote,
    Smartphone,
    Landmark,
    Eye,
    EyeOff,
    Book,
    Info
} from 'lucide-react';

const UserGuide = () => {
    const [expandedSection, setExpandedSection] = useState(null);

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-emerald-600 text-white p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center space-x-3 mb-2">
                        <Book className="h-8 w-8" />
                        <h1 className="text-2xl font-bold">Expense Manager User Guide</h1>
                    </div>
                    <p className="text-emerald-100">
                        Complete guide to managing your personal and group expenses
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6 space-y-6">
                
                {/* Quick Start */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                        Quick Start
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                            <div>
                                <p className="font-medium text-gray-800">Sign Up or Login</p>
                                <p className="text-gray-600 text-sm">Create your account or login to start tracking expenses</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                            <div>
                                <p className="font-medium text-gray-800">Add Your First Expense</p>
                                <p className="text-gray-600 text-sm">Use the + button to record your first expense</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                            <div>
                                <p className="font-medium text-gray-800">Create a Group</p>
                                <p className="text-gray-600 text-sm">Start splitting expenses with friends and family</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Overview */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                        App Navigation
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <Home className="h-6 w-6 text-emerald-600" />
                                <div>
                                    <p className="font-medium text-gray-800">Home</p>
                                    <p className="text-sm text-gray-600">View and manage personal expenses</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <BarChart2 className="h-6 w-6 text-emerald-600" />
                                <div>
                                    <p className="font-medium text-gray-800">Analysis</p>
                                    <p className="text-sm text-gray-600">View spending analytics and charts</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <Users className="h-6 w-6 text-emerald-600" />
                                <div>
                                    <p className="font-medium text-gray-800">Groups</p>
                                    <p className="text-sm text-gray-600">Manage group expenses and settlements</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <User className="h-6 w-6 text-emerald-600" />
                                <div>
                                    <p className="font-medium text-gray-800">Account</p>
                                    <p className="text-sm text-gray-600">Profile settings and app preferences</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Expense Management */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div 
                        className="p-6 cursor-pointer"
                        onClick={() => toggleSection('personal')}
                    >
                        <h2 className="text-xl font-bold text-gray-800 flex items-center justify-between">
                            <span className="flex items-center">
                                <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                                Personal Expense Management
                            </span>
                            <ChevronRight className={`h-5 w-5 transition-transform ${expandedSection === 'personal' ? 'rotate-90' : ''}`} />
                        </h2>
                    </div>
                    
                    {expandedSection === 'personal' && (
                        <div className="px-6 pb-6 space-y-6">
                            {/* Adding Expenses */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                                    <Plus className="h-5 w-5 text-emerald-600 mr-2" />
                                    Adding Expenses
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <span className="bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">1</span>
                                        <p className="text-sm text-gray-700">Click the <strong>+ Add Expense</strong> button from the home page</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <span className="bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">2</span>
                                        <p className="text-sm text-gray-700">Fill in the expense details: amount, description, category, and payment method</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <span className="bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">3</span>
                                        <p className="text-sm text-gray-700">Select the date (defaults to today)</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <span className="bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">4</span>
                                        <p className="text-sm text-gray-700">Click <strong>Add Expense</strong> to save</p>
                                    </div>
                                </div>
                            </div>

                            {/* Categories */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Expense Categories</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { name: 'Food', icon: UtensilsCrossed, color: 'bg-emerald-100 text-emerald-600' },
                                        { name: 'Transport', icon: Car, color: 'bg-sky-100 text-sky-600' },
                                        { name: 'Entertainment', icon: Music, color: 'bg-violet-100 text-violet-600' },
                                        { name: 'Utilities', icon: Lightbulb, color: 'bg-amber-100 text-amber-600' },
                                        { name: 'Shopping', icon: ShoppingBag, color: 'bg-rose-100 text-rose-600' },
                                        { name: 'Health', icon: Stethoscope, color: 'bg-pink-100 text-pink-600' },
                                        { name: 'Rent', icon: Home, color: 'bg-indigo-100 text-indigo-600' },
                                        { name: 'Other', icon: Plus, color: 'bg-slate-100 text-slate-600' }
                                    ].map((category) => (
                                        <div key={category.name} className={`p-3 rounded-lg ${category.color} flex items-center space-x-2`}>
                                            <category.icon className="h-4 w-4" />
                                            <span className="text-sm font-medium">{category.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Payment Methods</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { name: 'Card', icon: CreditCard },
                                        { name: 'Cash', icon: Banknote },
                                        { name: 'Mobile', icon: Smartphone },
                                        { name: 'Bank', icon: Landmark }
                                    ].map((method) => (
                                        <div key={method.name} className="p-3 bg-gray-50 rounded-lg flex items-center space-x-2">
                                            <method.icon className="h-4 w-4 text-gray-600" />
                                            <span className="text-sm font-medium text-gray-700">{method.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Filtering and Viewing */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Filtering & Viewing Expenses</h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                    <p className="text-sm text-gray-700">• Filter expenses by category or payment method</p>
                                    <p className="text-sm text-gray-700">• View expense details by clicking on any expense card</p>
                                    <p className="text-sm text-gray-700">• Delete expenses by clicking the delete button</p>
                                    <p className="text-sm text-gray-700">• Use the drawer to quickly add expenses from the home page</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Group Expense Management */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div 
                        className="p-6 cursor-pointer"
                        onClick={() => toggleSection('groups')}
                    >
                        <h2 className="text-xl font-bold text-gray-800 flex items-center justify-between">
                            <span className="flex items-center">
                                <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                                Group Expense Management
                            </span>
                            <ChevronRight className={`h-5 w-5 transition-transform ${expandedSection === 'groups' ? 'rotate-90' : ''}`} />
                        </h2>
                    </div>
                    
                    {expandedSection === 'groups' && (
                        <div className="px-6 pb-6 space-y-6">
                            {/* Creating Groups */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                                    <Users className="h-5 w-5 text-emerald-600 mr-2" />
                                    Creating a Group
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <span className="bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">1</span>
                                        <p className="text-sm text-gray-700">Go to the <strong>Groups</strong> tab</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <span className="bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">2</span>
                                        <p className="text-sm text-gray-700">Click <strong>Create Group</strong></p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <span className="bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">3</span>
                                        <p className="text-sm text-gray-700">Enter group name and add initial members</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <span className="bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">4</span>
                                        <p className="text-sm text-gray-700">Start adding group expenses</p>
                                    </div>
                                </div>
                            </div>

                            {/* Group Features */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Group Features</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start space-x-3">
                                            <Plus className="h-5 w-5 text-emerald-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-gray-800">Add Members</p>
                                                <p className="text-sm text-gray-600">Invite friends to join your expense group</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <Plus className="h-5 w-5 text-emerald-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-gray-800">Add Group Expenses</p>
                                                <p className="text-sm text-gray-600">Record expenses and split them among members</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-start space-x-3">
                                            <Calculator className="h-5 w-5 text-emerald-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-gray-800">Settle Up</p>
                                                <p className="text-sm text-gray-600">Calculate who owes what and settle balances</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <BarChart2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-gray-800">Track Spending</p>
                                                <p className="text-sm text-gray-600">See personal spending breakdown</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Group Tabs */}
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Group Page Tabs</h3>
                                <div className="space-y-3">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-medium text-gray-800 mb-2">Total Paid</h4>
                                        <p className="text-sm text-gray-600">• Shows how much each member has paid for group expenses</p>
                                        <p className="text-sm text-gray-600">• Includes personal spending breakdown showing each member's actual consumption</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-medium text-gray-800 mb-2">Members</h4>
                                        <p className="text-sm text-gray-600">• View all group members and their current balances</p>
                                        <p className="text-sm text-gray-600">• See who owes money and who should receive money</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-medium text-gray-800 mb-2">History</h4>
                                        <p className="text-sm text-gray-600">• Complete history of all group expenses</p>
                                        <p className="text-sm text-gray-600">• View who paid for what and how expenses were split</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Personal Spending Feature */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div 
                        className="p-6 cursor-pointer"
                        onClick={() => toggleSection('spending')}
                    >
                        <h2 className="text-xl font-bold text-gray-800 flex items-center justify-between">
                            <span className="flex items-center">
                                <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                                Personal Spending Breakdown
                            </span>
                            <ChevronRight className={`h-5 w-5 transition-transform ${expandedSection === 'spending' ? 'rotate-90' : ''}`} />
                        </h2>
                    </div>
                    
                    {expandedSection === 'spending' && (
                        <div className="px-6 pb-6 space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start space-x-2">
                                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-medium text-blue-800 mb-2">What is Personal Spending?</h3>
                                        <p className="text-sm text-blue-700">
                                            Personal spending shows how much each group member actually consumed or benefited from, 
                                            based on their participation in each expense. This is different from how much they paid.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium text-gray-800 mb-3">Example:</h3>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <p><strong>Trip to Goa Group:</strong></p>
                                    <p>• Hotel Booking: ₹8,000 (split among 3 people = ₹2,666.67 each)</p>
                                    <p>• Flight Tickets: ₹4,500 (split among 3 people = ₹1,500.00 each)</p>
                                    <p><strong>Each member's personal spending: ₹4,166.67</strong></p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm text-gray-700">• View this breakdown in the "Total Paid" tab of any group</p>
                                <p className="text-sm text-gray-700">• Helps understand actual consumption vs. payments made</p>
                                <p className="text-sm text-gray-700">• Useful for transparent expense tracking and reconciliation</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Settlement & Balance */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div 
                        className="p-6 cursor-pointer"
                        onClick={() => toggleSection('settlement')}
                    >
                        <h2 className="text-xl font-bold text-gray-800 flex items-center justify-between">
                            <span className="flex items-center">
                                <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">6</span>
                                Settlement & Balance Calculation
                            </span>
                            <ChevronRight className={`h-5 w-5 transition-transform ${expandedSection === 'settlement' ? 'rotate-90' : ''}`} />
                        </h2>
                    </div>
                    
                    {expandedSection === 'settlement' && (
                        <div className="px-6 pb-6 space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                                    <Calculator className="h-5 w-5 text-emerald-600 mr-2" />
                                    How Balances are Calculated
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="text-center text-lg font-medium text-gray-800 mb-3">
                                        Net Balance = Amount Paid - Personal Share
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p>• <strong>Positive balance:</strong> Member gets money back</p>
                                        <p>• <strong>Negative balance:</strong> Member owes money</p>
                                        <p>• <strong>Zero balance:</strong> Member is settled</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Settlement Process</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <span className="bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">1</span>
                                        <p className="text-sm text-gray-700">Click <strong>Settle Up</strong> in the group page</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <span className="bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">2</span>
                                        <p className="text-sm text-gray-700">View each member's balance (positive = gets money, negative = owes money)</p>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <span className="bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">3</span>
                                        <p className="text-sm text-gray-700">Follow the suggested transactions to minimize number of transfers</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-medium text-green-800 mb-2">Settlement Example</h4>
                                <div className="space-y-1 text-sm text-green-700">
                                    <p>If Alice paid ₹1000 but her share is ₹600:</p>
                                    <p><strong>Alice's balance: +₹400</strong> (she gets ₹400 back)</p>
                                    <p>If Bob paid ₹200 but his share is ₹600:</p>
                                    <p><strong>Bob's balance: -₹400</strong> (he owes ₹400)</p>
                                    <p><strong>Settlement:</strong> Bob pays Alice ₹400</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Analytics */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div 
                        className="p-6 cursor-pointer"
                        onClick={() => toggleSection('analytics')}
                    >
                        <h2 className="text-xl font-bold text-gray-800 flex items-center justify-between">
                            <span className="flex items-center">
                                <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">7</span>
                                Analytics & Insights
                            </span>
                            <ChevronRight className={`h-5 w-5 transition-transform ${expandedSection === 'analytics' ? 'rotate-90' : ''}`} />
                        </h2>
                    </div>
                    
                    {expandedSection === 'analytics' && (
                        <div className="px-6 pb-6 space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Available Charts</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-medium text-gray-800 mb-2">Category Breakdown</h4>
                                        <p className="text-sm text-gray-600">Pie chart showing spending by category</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-medium text-gray-800 mb-2">Monthly/Daily Trends</h4>
                                        <p className="text-sm text-gray-600">Line chart showing spending over time</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-medium text-gray-800 mb-2">Payment Method Analysis</h4>
                                        <p className="text-sm text-gray-600">Bar chart showing preferred payment methods</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-medium text-gray-800 mb-2">Total Spending</h4>
                                        <p className="text-sm text-gray-600">Overall summary of your expenses</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">View Options</h3>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <p>• Switch between Monthly and Daily views</p>
                                    <p>• Interactive charts with hover details</p>
                                    <p>• Visual insights into spending patterns</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tips & Best Practices */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">8</span>
                        Tips & Best Practices
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-800">Record Expenses Immediately</p>
                                    <p className="text-sm text-gray-600">Add expenses as soon as you make them for accurate tracking</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-800">Use Groups for Shared Expenses</p>
                                    <p className="text-sm text-gray-600">Create groups for trips, shared living, or regular activities</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <BarChart2 className="h-5 w-5 text-purple-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-800">Review Analytics Regularly</p>
                                    <p className="text-sm text-gray-600">Check your spending patterns to make informed financial decisions</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Calculator className="h-5 w-5 text-orange-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-gray-800">Settle Regularly</p>
                                    <p className="text-sm text-gray-600">Use the settle up feature to clear balances frequently</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-emerald-800 mb-3">Need Help?</h2>
                    <p className="text-emerald-700 mb-4">
                        This comprehensive guide covers all features of the Expense Manager app. 
                        If you encounter any issues or need additional support, please reach out to our support team.
                    </p>
                    <div className="flex items-center space-x-2 text-emerald-600">
                        <Info className="h-5 w-5" />
                        <span className="text-sm font-medium">Happy expense tracking! 🎉</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserGuide;
