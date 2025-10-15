"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(700000);
  const [tenure, setTenure] = useState(10);
  const [interestRate, setInterestRate] = useState(7);
  const router = useRouter();

  // Calculate loan details
  const calculateLoan = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = tenure * 12;

    // EMI calculation formula for home loans
    let emi = 0;
    if (monthlyRate === 0) {
      emi = principal / totalMonths;
    } else {
      emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    const totalAmount = emi * totalMonths;
    const interestAmount = totalAmount - principal;

    return {
      emi: Math.round(emi),
      principalAmount: principal,
      interestAmount: Math.round(interestAmount),
      totalAmount: Math.round(totalAmount),
    };
  };

  const loanDetails = calculateLoan();

  // Calculate percentages for the donut chart
  const principalPercentage = Math.round(
    (loanDetails.principalAmount / loanDetails.totalAmount) * 100
  );
  const interestPercentage = 100 - principalPercentage;

  return (
    <div className="lg:px-20 py-16 px-3">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-8">
        {/* Left Column - Sliders */}
        <div className="space-y-12 w-full lg:w-1/2">
          {/* Loan Amount Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold text-gray-900">Loan Amount</p>
              <div
                className="px-5 py-3 rounded-md font-bold text-nbr-black10"
                style={{ backgroundColor: "#F7FBF6" }}
              >
                ₹{loanAmount.toLocaleString()}
              </div>
            </div>
            <div className="relative">
              <input
                type="range"
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-green-100 slider-thumb-green"
                min="100000"
                max="10000000"
                step="100000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #136C01 0%, #136C01 ${
                    ((loanAmount - 100000) / 9900000) * 100
                  }%, #F1F6F1 ${
                    ((loanAmount - 100000) / 9900000) * 100
                  }%, #F1F6F1 100%)`,
                }}
              />
              <div className="absolute -bottom-6 left-0 text-[15px] font-medium leading-[110%] text-nbr-gray02 font-roboto">
                ₹1 Lac
              </div>
              <div className="absolute -bottom-6 right-0 text-[15px] font-medium leading-[110%] text-nbr-gray02 font-roboto">
                ₹1 Cr
              </div>
            </div>
          </div>

          {/* Tenure Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold text-gray-900">Tenure (Years)</p>
              <div
                className="px-5 py-3 rounded-md font-bold text-nbr-black10"
                style={{ backgroundColor: "#F7FBF6" }}
              >
                {tenure}
              </div>
            </div>
            <div className="relative">
              <input
                type="range"
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-green-100 slider-thumb-green"
                min="1"
                max="30"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #136C01 0%, #136C01 ${
                    ((tenure - 1) / 29) * 100
                  }%, #F1F6F1 ${((tenure - 1) / 29) * 100}%, #F1F6F1 100%)`,
                }}
              />
              <div className="absolute -bottom-6 left-0 text-[15px] font-medium leading-[110%] text-nbr-gray02 font-roboto">
                1
              </div>
              <div className="absolute -bottom-6 right-0 text-[15px] font-medium leading-[110%] text-nbr-gray02 font-roboto">
                30
              </div>
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold text-gray-900">
                Interest rate (% P.A)
              </p>
              <div
                className="px-5 py-3 rounded-md font-bold text-nbr-black19"
                style={{ backgroundColor: "#F7FBF6" }}
              >
                {interestRate}%
              </div>
            </div>
            <div className="relative">
              <input
                type="range"
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-green-100 slider-thumb-green"
                min="0.5"
                max="15"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #136C01 0%, #136C01 ${
                    ((interestRate - 0.5) / 14.5) * 100
                  }%, #F1F6F1 ${
                    ((interestRate - 0.5) / 14.5) * 100
                  }%, #F1F6F1 100%)`,
                }}
              />
              <div className="absolute -bottom-6 left-0 text-[15px] font-medium leading-[110%] text-nbr-gray02 font-roboto">
                0.5%
              </div>
              <div className="absolute -bottom-6 right-0 text-[15px] font-medium leading-[110%] text-nbr-gray02 font-roboto">
                15%
              </div>
            </div>
          </div>

          {/* CSS for custom range input slider thumbs */}
          <style jsx>{`
            .slider-thumb-green::-webkit-slider-thumb {
              appearance: none;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: #136c01;
              cursor: pointer;
              border: none;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .slider-thumb-green::-moz-range-thumb {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: #136c01;
              cursor: pointer;
              border: none;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .slider-thumb-green::-ms-thumb {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: #136c01;
              cursor: pointer;
              border: none;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
          `}</style>
        </div>

        {/* Right Column - Results and Chart */}
        <div className="flex flex-col lg:flex-row gap-8 w-full lg:w-1/2">
          {/* Results */}
          <div
            className="p-6 rounded-lg w-full lg:w-1/2"
            style={{ backgroundColor: "#F7FBF6" }}
          >
            <div className="flex flex-col gap-5">
              {/* Monthly EMI */}
              <div>
                <p className="text-base font-normal leading-6 tracking-normal text-nbr-black01 font-roboto">
                  Monthly Loan EMI
                </p>

                <p className="text-[32px] font-bold leading-[48px] tracking-normal text-nbr-green font-roboto">
                  ₹{loanDetails.emi.toLocaleString()}
                </p>
              </div>

              {/* Principal Amount */}
              <div>
                <p className="text-base font-normal leading-6 tracking-normal text-nbr-black01 font-roboto">
                  Principal Amount
                </p>
                <p className="text-[20px] font-medium leading-[30px] tracking-normal text-black01 font-roboto">
                  ₹{loanDetails.principalAmount.toLocaleString()}
                </p>
              </div>

              {/* Interest Amount */}
              <div>
                <p className="text-base font-normal leading-6 tracking-normal text-nbr-black01 font-roboto">
                  Interest Amount
                </p>
                <p className="text-[20px] font-medium leading-[30px] tracking-normal text-black01 font-roboto">
                  ₹{loanDetails.interestAmount.toLocaleString()}
                </p>
              </div>

              {/* Total Amount */}
              <div>
                <p className="text-base font-normal leading-6 tracking-normal text-nbr-black01 font-roboto">
                  Total Amount Payable
                </p>
                <p className="text-[20px] font-medium leading-[30px] tracking-normal text-black01 font-roboto">
                  ₹{loanDetails.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="flex flex-col justify-center items-center w-full lg:w-1/2">
            <div className="w-58 h-58 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Create donut chart using SVG */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#D9E7D6"
                  strokeWidth="20"
                />

                {/* Interest portion - adjust stroke dasharray for correct proportions */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#136C01"
                  strokeWidth="20"
                  strokeDasharray={`${interestPercentage * 2.51} ${
                    251 - interestPercentage * 2.51
                  }`}
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />

                {/* Interest percentage label - Positioned in center of interest segment */}
                <text
                  x={
                    50 +
                    40 *
                      Math.cos(
                        ((-90 + (interestPercentage * 3.6) / 2) * Math.PI) / 180
                      )
                  }
                  y={
                    50 +
                    40 *
                      Math.sin(
                        ((-90 + (interestPercentage * 3.6) / 2) * Math.PI) / 180
                      )
                  }
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="8"
                  fontWeight="bold"
                >
                  {interestPercentage}%
                </text>

                {/* Principal percentage label - Positioned in center of principal segment */}
                <text
                  x={
                    50 +
                    40 *
                      Math.cos(
                        ((-90 +
                          interestPercentage * 3.6 +
                          (principalPercentage * 3.6) / 2) *
                          Math.PI) /
                          180
                      )
                  }
                  y={
                    50 +
                    40 *
                      Math.sin(
                        ((-90 +
                          interestPercentage * 3.6 +
                          (principalPercentage * 3.6) / 2) *
                          Math.PI) /
                          180
                      )
                  }
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="8"
                  fontWeight="bold"
                >
                  {principalPercentage}%
                </text>
              </svg>
            </div>
            <div className="flex justify-center items-center mt-4 space-x-8">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-nbr-green"></div>
                <span className="text-sm">Intrest</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2 "
                  style={{ backgroundColor: "#D9E7D6" }}
                ></div>
                <span className="text-sm">Principle</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
