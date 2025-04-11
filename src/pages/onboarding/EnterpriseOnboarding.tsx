
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

// SASB Industries - a subset for demo purposes
const industries = [
  "Apparel, Accessories & Footwear",
  "Building Products & Furnishings",
  "E-Commerce",
  "Education",
  "Electronics",
  "Food & Beverage",
  "Healthcare",
  "Hospitality",
  "Insurance",
  "Internet Media & Services",
  "Investment Banking",
  "Medical Equipment & Supplies",
  "Pharmaceuticals",
  "Real Estate",
  "Renewable Resources & Alternative Energy",
  "Software & IT Services",
  "Telecommunication Services",
  "Transportation",
  "Waste Management",
  "Water Utilities & Services",
  "Combination (Multiple Industries)",
];

const EnterpriseOnboarding = () => {
  const [step, setStep] = useState(1);
  const [platformType, setPlatformType] = useState<string>("");
  const [investmentRound, setInvestmentRound] = useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [multipleIndustries, setMultipleIndustries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContinue = () => {
    if (step === 1) {
      if (!platformType) {
        toast({
          title: "Please select an option",
          description: "Please select ESG Due Diligence or Complete Platform",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (platformType === "esg_due_diligence" && !investmentRound) {
        toast({
          title: "Please select an investment round",
          variant: "destructive",
        });
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!selectedIndustry) {
        toast({
          title: "Please select an industry",
          variant: "destructive",
        });
        return;
      }
      
      // If combination is selected and no multiple industries are chosen
      if (selectedIndustry === "Combination (Multiple Industries)" && multipleIndustries.length === 0) {
        toast({
          title: "Please select at least one industry",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);

      // In a real app, we'd save this data to the API
      // For demo, we'll just simulate a delay and navigate
      setTimeout(() => {
        toast({
          title: "Onboarding complete",
          description: "Your account has been set up successfully",
        });
        navigate("/dashboard/general");
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleIndustrySelect = (industry: string) => {
    if (industry === "Combination (Multiple Industries)") {
      setSelectedIndustry(industry);
    } else {
      setSelectedIndustry(industry);
      setMultipleIndustries([]); // Reset multiple industries if a single one is selected
    }
  };

  const toggleMultipleIndustry = (industry: string) => {
    if (multipleIndustries.includes(industry)) {
      setMultipleIndustries(multipleIndustries.filter((i) => i !== industry));
    } else {
      setMultipleIndustries([...multipleIndustries, industry]);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle>Welcome to Fandoro Sustainability Hub</CardTitle>
              <CardDescription>
                Please select which platform you would like to use:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={platformType}
                onValueChange={setPlatformType}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="esg_due_diligence" id="esg_due_diligence" />
                  <Label htmlFor="esg_due_diligence" className="flex-1 cursor-pointer">
                    <div className="font-medium">ESG Due Diligence</div>
                    <div className="text-sm text-muted-foreground">
                      Assessment focused on Environmental, Social, and Governance factors
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="complete_platform" id="complete_platform" />
                  <Label htmlFor="complete_platform" className="flex-1 cursor-pointer">
                    <div className="font-medium">Complete Platform</div>
                    <div className="text-sm text-muted-foreground">
                      Full access to all sustainability management features
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </>
        );
      case 2:
        return platformType === "esg_due_diligence" ? (
          <>
            <CardHeader>
              <CardTitle>Investment Round</CardTitle>
              <CardDescription>
                Please select your current investment round:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={investmentRound}
                onValueChange={setInvestmentRound}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="seed" id="seed" />
                  <Label htmlFor="seed" className="flex-1 cursor-pointer">
                    <div className="font-medium">Seed</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="pre_series_a" id="pre_series_a" />
                  <Label htmlFor="pre_series_a" className="flex-1 cursor-pointer">
                    <div className="font-medium">Pre-Series A</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="series_a" id="series_a" />
                  <Label htmlFor="series_a" className="flex-1 cursor-pointer">
                    <div className="font-medium">Series A</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="series_b_plus" id="series_b_plus" />
                  <Label htmlFor="series_b_plus" className="flex-1 cursor-pointer">
                    <div className="font-medium">Series B and above</div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Complete Platform Selected</CardTitle>
              <CardDescription>
                You've selected the complete platform with all features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
                <div className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <p>
                    The complete platform gives you access to all sustainability
                    management features, including ESG Due Diligence, Compliance
                    Management, EHS Trainings, Supplier Sustainability Audits, and more.
                  </p>
                </div>
              </div>
            </CardContent>
          </>
        );
      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle>Industry Selection</CardTitle>
              <CardDescription>
                Please select your primary industry:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Select
                    value={selectedIndustry}
                    onValueChange={handleIndustrySelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedIndustry === "Combination (Multiple Industries)" && (
                  <div className="mt-4 border rounded-md p-4">
                    <h3 className="text-sm font-medium mb-2">
                      Select applicable industries:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {industries
                        .filter((i) => i !== "Combination (Multiple Industries)")
                        .map((industry) => (
                          <div key={industry} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`industry-${industry}`}
                              checked={multipleIndustries.includes(industry)}
                              onChange={() => toggleMultipleIndustry(industry)}
                              className="rounded border-gray-300 text-fandoro-green focus:ring-fandoro-green"
                            />
                            <Label
                              htmlFor={`industry-${industry}`}
                              className="text-sm cursor-pointer"
                            >
                              {industry}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-fandoro-green">Fandoro</h1>
          <p className="text-muted-foreground">Sustainability Hub</p>
        </div>

        <Card>
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center ${
                    i < step ? "text-fandoro-green" : i === step ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      i < step
                        ? "bg-fandoro-green text-white"
                        : i === step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {i < step ? <Check size={16} /> : i}
                  </div>
                  <div className="text-xs mt-1">
                    {i === 1
                      ? "Platform"
                      : i === 2
                      ? "Details"
                      : "Industry"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {renderStep()}

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (step > 1) setStep(step - 1);
                else navigate("/login");
              }}
            >
              {step > 1 ? "Back" : "Cancel"}
            </Button>
            <Button onClick={handleContinue} disabled={isLoading}>
              {step === 3
                ? isLoading
                  ? "Setting up..."
                  : "Complete Setup"
                : "Continue"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EnterpriseOnboarding;
