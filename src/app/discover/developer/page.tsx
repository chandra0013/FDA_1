
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code2, KeyRound, Terminal, Book } from 'lucide-react';

const devSections = [
    { id: 'api', title: 'API Reference', icon: <Code2 /> },
    { id: 'sdk', title: 'SDK & CLI', icon: <Terminal /> },
    { id: 'auth', title: 'Authentication', icon: <KeyRound /> },
    { id: 'integrations', title: 'Integrations', icon: <Book /> },
]

export default function DeveloperPage() {
  return (
    <div className="container py-24 sm:py-32">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
                Developer Center
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Build with the Blue Query API, SDKs, and tools.
            </p>
        </div>

        <Tabs defaultValue="api" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
                {devSections.map(section => (
                    <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
                        {section.icon} {section.title}
                    </TabsTrigger>
                ))}
            </TabsList>
            <TabsContent value="api">
                <Card>
                    <CardHeader>
                        <CardTitle>API Reference</CardTitle>
                        <CardDescription>Endpoints for chat, RAG, forecast, and report generation.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <h3 className="font-semibold">Coming Soon</h3>
                        <p className="text-muted-foreground">Detailed API documentation with request and response examples will be available here shortly.</p>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="sdk">
                <Card>
                    <CardHeader>
                        <CardTitle>SDK & CLI</CardTitle>
                        <CardDescription>Code samples in JavaScript, Python, and Bash.</CardDescription>
                    </CardHeader>
                     <CardContent className="space-y-4">
                        <h3 className="font-semibold">Coming Soon</h3>
                        <p className="text-muted-foreground">Our SDKs and command-line interface are under active development. Check back for updates.</p>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="auth">
                <Card>
                    <CardHeader>
                        <CardTitle>Authentication</CardTitle>
                        <CardDescription>Firebase Auth, App Check, and service account setup.</CardDescription>
                    </CardHeader>
                     <CardContent className="space-y-4">
                        <h3 className="font-semibold">Coming Soon</h3>
                        <p className="text-muted-foreground">Guides on securing your application and authenticating with our services will be published here.</p>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="integrations">
                <Card>
                    <CardHeader>
                        <CardTitle>Webhooks & Integrations</CardTitle>
                        <CardDescription>Embed chat and dashboards in external apps.</CardDescription>
                    </CardHeader>
                     <CardContent className="space-y-4">
                        <h3 className="font-semibold">Coming Soon</h3>
                        <p className="text-muted-foreground">Learn how to integrate Blue Query into your existing workflows and applications.</p>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
