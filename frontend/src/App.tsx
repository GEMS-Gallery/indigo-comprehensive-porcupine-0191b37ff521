import React, { useState, useEffect, useCallback } from 'react';
import { backend } from 'declarations/backend';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, IconButton, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Delete, Folder, InsertDriveFile, CloudUpload } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

type File = {
  id: number;
  name: string;
  size: bigint;
  createdAt: bigint;
  isFolder: boolean;
};

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm();

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const result = await backend.getFiles();
      setFiles(result);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Failed to fetch files. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const performHealthCheck = useCallback(async () => {
    try {
      const result = await backend.healthCheck();
      console.log('Health check result:', result);
      setError(null);
    } catch (err) {
      console.error('Health check failed:', err);
      setError('Health check failed. Please contact support.');
    }
  }, []);

  useEffect(() => {
    fetchFiles();
    performHealthCheck();
  }, [fetchFiles, performHealthCheck]);

  const onSubmit = async (data: { name: string, size: number, isFolder: boolean }) => {
    try {
      setLoading(true);
      const result = await backend.addFile(data.name, BigInt(data.size), data.isFolder);
      if ('ok' in result) {
        console.log('File added with ID:', result.ok);
        reset();
        await fetchFiles();
      } else {
        setError(result.err);
      }
    } catch (err) {
      console.error('Error adding file:', err);
      setError('Failed to add file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const result = await backend.deleteFile(id);
      if ('ok' in result) {
        console.log('File deleted successfully');
        await fetchFiles();
      } else {
        setError(result.err);
      }
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Failed to delete file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AppBar position="static" className="bg-blue-600">
        <Toolbar>
          <Typography variant="h6">FileBox</Typography>
        </Toolbar>
      </AppBar>
      <Container className="py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 p-4 bg-white rounded shadow">
          <div className="flex space-x-4">
            <input {...register('name')} placeholder="File name" className="flex-grow p-2 border rounded" />
            <input {...register('size')} type="number" placeholder="Size (bytes)" className="w-32 p-2 border rounded" />
            <label className="flex items-center">
              <input {...register('isFolder')} type="checkbox" className="mr-2" />
              Is Folder
            </label>
            <Button type="submit" variant="contained" startIcon={<CloudUpload />} className="bg-blue-500 hover:bg-blue-600">
              Add
            </Button>
          </div>
        </form>
        {loading ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <Grid container spacing={3}>
            {files.map((file) => (
              <Grid item xs={12} sm={6} md={4} key={file.id}>
                <Card>
                  <CardContent className="flex items-center justify-between">
                    <div className="flex items-center">
                      {file.isFolder ? <Folder className="text-yellow-500 mr-2" /> : <InsertDriveFile className="text-blue-500 mr-2" />}
                      <div>
                        <Typography variant="subtitle1">{file.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {file.isFolder ? 'Folder' : `${Number(file.size).toLocaleString()} bytes`}
                        </Typography>
                      </div>
                    </div>
                    <IconButton onClick={() => handleDelete(file.id)} size="small">
                      <Delete />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <Snackbar
        open={error !== null}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
