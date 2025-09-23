
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Terminal } from 'lucide-react';
import Papa from 'papaparse';
import { useToast } from '@/hooks/use-toast';
import { useSWRConfig } from 'swr';
import { ARGO_FLOATS_SWR_KEY } from '@/hooks/use-argo-floats';

export default function SdkPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState<string[]>(['Welcome to the Blue Query CLI. Type `help` for a list of commands.']);
    const { toast } = useToast();
    const { mutate } = useSWRConfig();

    const handleCommand = () => {
        const newOutput = [...output, `> ${input}`];
        const [command, ...args] = input.split(' ');

        if (command === 'import') {
            const csvData = args.join(' ');
            if (!csvData) {
                newOutput.push('Error: No data provided. Usage: import <paste_csv_data_here>');
                setOutput(newOutput);
                setInput('');
                return;
            }

            Papa.parse(csvData, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    try {
                        const parsedData = (results.data as any[]).map(row => {
                            const lat = parseFloat(row.Latitude || row.lat);
                            const lng = parseFloat(row.Longitude || row.lng);

                            if (isNaN(lat) || isNaN(lng)) {
                                throw new Error(`Invalid coordinate data for float: ${row.Float_ID || row.id}`);
                            }
                             const sea = row.sea || (row.Location_Reference?.toLowerCase().includes('arabian') ? 'Arabian Sea' : 'Bay of Bengal');

                            return {
                                id: row.Float_ID || row.id,
                                lat: lat,
                                lng: lng,
                                location: row.Location_Reference || row.location,
                                sea: sea
                            };
                        });
                        
                        mutate(ARGO_FLOATS_SWR_KEY, parsedData, false);
                        
                        newOutput.push(`Success: Imported ${parsedData.length} floats.`);
                        toast({
                            title: "Data Imported",
                            description: `${parsedData.length} floats loaded successfully via CLI.`,
                        });
                    } catch (error: any) {
                        newOutput.push(`Error: ${error.message}`);
                        toast({
                            title: "CSV Parsing Error",
                            description: error.message || "Could not parse the CSV data.",
                            variant: "destructive",
                        });
                    }
                     setOutput(newOutput);
                },
                error: (error: any) => {
                    newOutput.push(`Error: ${error.message}`);
                    toast({
                        title: "Parsing Error",
                        description: error.message,
                        variant: "destructive",
                    });
                     setOutput(newOutput);
                }
            });

        } else if (command === 'help') {
            newOutput.push('Available commands:');
            newOutput.push('`import <csv_data>` - Imports float data from raw CSV text.');
            newOutput.push('`clear` - Clears the terminal output.');
            setOutput(newOutput);
        } else if (command === 'clear') {
            setOutput([]);
        } else {
            newOutput.push(`Command not found: ${command}`);
            setOutput(newOutput);
        }
        setInput('');
    };

    return (
        <div className="container py-24 sm:py-32">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Terminal /> Blue Query CLI
                    </CardTitle>
                    <CardDescription>
                        Import data by pasting raw CSV content into the command input. Use `import` command.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-black text-white font-mono text-sm rounded-lg p-4 h-96 overflow-y-auto">
                        {output.map((line, index) => (
                            <p key={index} className="whitespace-pre-wrap">{line}</p>
                        ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleCommand();
                                }
                            }}
                            placeholder="Enter command or paste CSV data here after `import` command..."
                            className="font-mono bg-black text-white"
                        />
                        <Button onClick={handleCommand}>Run</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
