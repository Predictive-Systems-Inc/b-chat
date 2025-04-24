'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { ChatHeader } from '@/components/chat-header';
import { AppSidebar } from '@/components/app-sidebar';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { generateUUID } from '@/lib/utils';

type Source = {
  id: string;
  name: string;
  logo: string;
  status: 'connected' | 'not_connected';
  lastSync?: string;
};

const sources: Source[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    logo: '/images/logo/drive.png',
    status: 'not_connected',
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    logo: '/images/logo/onedrive.png',
    status: 'not_connected',
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    logo: '/images/logo/dropbox.png',
    status: 'not_connected',
  },
  {
    id: 'slack',
    name: 'Slack',
    logo: '/images/logo/slack.png',
    status: 'not_connected',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    logo: '/images/logo/gmail.png',
    status: 'not_connected',
  },
  {
    id: 'github',
    name: 'GitHub',
    logo: '/images/logo/github.png',
    status: 'not_connected',
  },
  {
    id: 'jira',
    name: 'JIRA',
    logo: '/images/logo/jira.png',
    status: 'not_connected',
  },
  {
    id: 'confluence',
    name: 'Confluence',
    logo: '/images/logo/confluence.png',
    status: 'not_connected',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    logo: '/images/logo/salesforce.png',
    status: 'not_connected',
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    logo: '/images/logo/quickbooks.png',
    status: 'not_connected',
  },
  {
    id: 'sap',
    name: 'SAP',
    logo: '/images/logo/sap.png',
    status: 'not_connected',
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    logo: '/images/logo/teams.png',
    status: 'not_connected',
  },
];

const SourcesPage = () => {
  const [connectedSources, setConnectedSources] = useState<Source[]>([]);
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const chatId = generateUUID();

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('File uploaded successfully!');
        return data;
      }
      const { error } = await response.json();
      toast.error(error);
    } catch (error) {
      toast.error('Failed to upload file, please try again!');
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        await uploadFile(file);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex h-dvh">
      <AppSidebar user={session?.user} />
      <div className="flex flex-col flex-1 min-w-0">
        <ChatHeader
          chatId={chatId}
          selectedModelId=""
          selectedVisibilityType="private"
          isReadonly={false}
        />
        <div className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Connect Your Data Sources</h1>
            <p className="text-muted-foreground mt-2">
              Link your tools so AI can access relevant knowledge across your
              organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Data Source Grid */}
            {sources.map((source) => (
              <Card key={source.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="relative w-6 h-6">
                      <Image
                        src={source.logo}
                        alt={source.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    {source.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        source.status === 'connected'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {source.status === 'connected'
                        ? 'Connected'
                        : 'Not Connected'}
                    </span>
                    <Button
                      variant={
                        source.status === 'connected' ? 'outline' : 'default'
                      }
                      size="sm"
                    >
                      {source.status === 'connected' ? 'Manage' : 'Connect'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* File Upload Card */}
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-6 w-6" />
                  File Upload
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag & drop files here or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: PDF, DOCX, CSV, TXT
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                  />
                  <Button
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload File'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Connected Sources Summary */}
          {connectedSources.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Connected Sources</h2>
              <div className="border rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Source</th>
                      <th className="text-left p-4">Date Connected</th>
                      <th className="text-left p-4">Last Sync</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {connectedSources.map((source) => (
                      <tr key={source.id} className="border-b">
                        <td className="p-4 flex items-center gap-2">
                          <div className="relative w-6 h-6">
                            <Image
                              src={source.logo}
                              alt={source.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          {source.name}
                        </td>
                        <td className="p-4">-</td>
                        <td className="p-4">-</td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Synced
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Sync Now
                            </Button>
                            <Button variant="outline" size="sm">
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SourcesPage;
