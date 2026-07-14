
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Banknote, Building2, Users, ArrowUpRight, BookOpenText, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const BusinessDevelopmentIndex = () => {
  const modules = [
    {
      title: "Leads",
      description: "Track and manage sales leads",
      icon: <ArrowUpRight className="h-6 w-6 text-blue-500" />,
      link: "/business-development/leads",
      count: "23 active",
      color: "bg-blue-50"
    },
    {
      title: "Companies",
      description: "Manage company information",
      icon: <Building2 className="h-6 w-6 text-indigo-500" />,
      link: "/business-development/companies",
      count: "48 total",
      color: "bg-indigo-50"
    },
    {
      title: "Contacts",
      description: "Maintain contacts database",
      icon: <Users className="h-6 w-6 text-violet-500" />,
      link: "/business-development/contacts",
      count: "127 contacts",
      color: "bg-violet-50"
    },
    {
      title: "Opportunities",
      description: "Track sales opportunities",
      icon: <BookOpenText className="h-6 w-6 text-green-500" />,
      link: "/business-development/opportunities",
      count: "15 open",
      color: "bg-green-50"
    },
    {
      title: "Debt Recovery",
      description: "Manage outstanding debts",
      icon: <Banknote className="h-6 w-6 text-red-500" />,
      link: "/business-development/debt-recovery",
      count: "6 overdue",
      color: "bg-red-50"
    },
    {
      title: "Relationship Managers",
      description: "Manage business development staff",
      icon: <UserPlus className="h-6 w-6 text-amber-500" />,
      link: "/business-development/relationship-managers",
      count: "4 active",
      color: "bg-amber-50"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Development</h1>
          <p className="text-muted-foreground">
            Manage leads, companies, contacts, and sales opportunities
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Link to={module.link} key={index}>
            <Card className="transition-all hover:shadow-md cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-lg ${module.color}`}>
                    {module.icon}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {module.count}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl mb-1">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BusinessDevelopmentIndex;
