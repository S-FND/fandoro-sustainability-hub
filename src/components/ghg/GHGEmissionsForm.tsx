
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface GHGEmissionsFormProps {
  scopeType: 'scope1' | 'scope2' | 'scope3';
  industryCategory: string;
}

const emissionSchema = z.object({
  emission_source: z.string().min(1, "Emission source is required"),
  emission_value: z.string().refine(val => !isNaN(Number(val)), {
    message: "Must be a valid number",
  }),
  emission_unit: z.string().min(1, "Unit of measurement is required"),
  reporting_period_start: z.date({
    required_error: "Start date is required",
  }),
  reporting_period_end: z.date({
    required_error: "End date is required",
  }),
});

export const GHGEmissionsForm = ({ scopeType, industryCategory }: GHGEmissionsFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof emissionSchema>>({
    resolver: zodResolver(emissionSchema),
    defaultValues: {
      emission_source: "",
      emission_value: "",
      emission_unit: "tonnes CO2e",
      reporting_period_start: new Date(),
      reporting_period_end: new Date(),
    }
  });

  const onSubmit = async (data: z.infer<typeof emissionSchema>) => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to submit emissions data",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert emission_value to number
      const formattedData = {
        ...data,
        emission_value: parseFloat(data.emission_value),
        enterprise_id: user.id,
        scope_type: scopeType,
        industry_category: industryCategory,
      };

      // Submit to Supabase
      const { error } = await supabase
        .from('enterprise_ghg_emissions')
        .insert([formattedData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Emissions data has been recorded",
      });

      form.reset();
    } catch (error) {
      console.error('Error submitting emissions data:', error);
      toast({
        title: "Error",
        description: "Failed to record emissions data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const emissionSourceOptions = {
    scope1: {
      manufacturing: [
        "Stationary combustion - natural gas",
        "Stationary combustion - fuel oil",
        "Mobile combustion - company vehicles",
        "Process emissions",
        "Fugitive emissions - refrigerants"
      ],
      technology: [
        "Stationary combustion - natural gas",
        "Diesel backup generators",
        "Mobile combustion - company vehicles",
        "Fugitive emissions - refrigerants"
      ],
      other: [
        "Stationary combustion",
        "Mobile combustion",
        "Fugitive emissions"
      ]
    },
    scope2: {
      manufacturing: [
        "Electricity consumption",
        "Steam",
        "Heat",
        "Cooling"
      ],
      technology: [
        "Electricity consumption - offices",
        "Electricity consumption - data centers",
        "Purchased cooling/heating"
      ],
      other: [
        "Electricity consumption",
        "Purchased heat/steam/cooling"
      ]
    },
    scope3: {
      manufacturing: [
        "Purchased goods and services",
        "Capital goods",
        "Fuel and energy-related activities",
        "Upstream transportation",
        "Waste generated in operations",
        "Business travel",
        "Employee commuting",
        "Downstream transportation",
        "Processing of sold products",
        "Use of sold products",
        "End-of-life treatment of sold products"
      ],
      technology: [
        "Purchased goods and services",
        "Capital goods",
        "Business travel",
        "Employee commuting",
        "Use of sold products",
        "Data center services",
        "Downstream data processing"
      ],
      other: [
        "Purchased goods and services",
        "Business travel",
        "Employee commuting",
        "Waste disposal",
        "Use of sold products"
      ]
    }
  };

  const units = [
    "tonnes CO2e",
    "kg CO2e",
    "metric tons CO2e",
    "litres",
    "kWh",
    "MWh",
    "GJ",
    "therms"
  ];

  // Get emission sources based on scope and industry
  const industry = industryCategory.toLowerCase();
  const industrySources = industry === 'manufacturing' || industry === 'technology' 
    ? emissionSourceOptions[scopeType][industry as keyof typeof emissionSourceOptions[typeof scopeType]]
    : emissionSourceOptions[scopeType].other;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{scopeType.toUpperCase().replace('SCOPE', 'Scope ')} Emissions</CardTitle>
        <CardDescription>
          Record your {scopeType} emissions data for {industryCategory}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="emission_source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emission Source</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select emission source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {industrySources.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="emission_value"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emission_unit"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="reporting_period_start"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full flex justify-start text-left font-normal"
                          >
                            {field.value ? format(field.value, "PPP") : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2020-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reporting_period_end"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full flex justify-start text-left font-normal"
                          >
                            {field.value ? format(field.value, "PPP") : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2020-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Record Emissions Data"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
