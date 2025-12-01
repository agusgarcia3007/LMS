'use client';

import { useState, useCallback } from 'react';
import {
  formatBytes,
  useFileUpload,
} from '@/hooks/use-file-upload';
import {
  Alert,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  TriangleAlert,
  UploadIcon,
  VideoIcon,
  XIcon,
  Loader2Icon,
  CheckCircle2Icon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useUploadVideo } from '@/services/lessons';

async function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(Math.round(video.duration));
    };
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video metadata'));
    };
    video.src = URL.createObjectURL(file);
  });
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

interface VideoUploadProps {
  existingVideoUrl?: string | null;
  existingDuration?: number;
  maxSize?: number;
  className?: string;
  disabled?: boolean;
  onVideoUploaded?: (data: { videoKey: string; videoUrl: string; duration: number }) => void;
  onVideoRemove?: () => void;
}

export function VideoUpload({
  existingVideoUrl,
  existingDuration = 0,
  maxSize = 500 * 1024 * 1024, // 500MB default
  className,
  disabled = false,
  onVideoUploaded,
  onVideoRemove,
}: VideoUploadProps) {
  const { t } = useTranslation();
  const uploadMutation = useUploadVideo();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState<{
    file: File;
    preview: string;
    duration: number;
    videoKey: string;
    videoUrl: string;
  } | null>(null);

  const processAndUpload = useCallback(async (file: File) => {
    setUploadProgress(10);

    try {
      setUploadProgress(20);
      const duration = await getVideoDuration(file);

      setUploadProgress(30);
      const base64 = await fileToBase64(file);

      setUploadProgress(50);
      const result = await uploadMutation.mutateAsync(base64);

      setUploadProgress(100);
      const preview = URL.createObjectURL(file);

      setUploadedVideo({
        file,
        preview,
        duration,
        videoKey: result.videoKey,
        videoUrl: result.videoUrl,
      });

      onVideoUploaded?.({ videoKey: result.videoKey, videoUrl: result.videoUrl, duration });
    } catch (error) {
      console.error('Error uploading video:', error);
      setUploadProgress(0);
    }
  }, [uploadMutation, onVideoUploaded]);

  const [
    { isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
      clearFiles,
    },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept: 'video/*',
    multiple: false,
    onFilesAdded: async (files) => {
      const file = files[0]?.file;
      if (file instanceof File) {
        await processAndUpload(file);
      }
    },
  });

  const handleRemoveVideo = useCallback(() => {
    if (uploadedVideo?.preview) {
      URL.revokeObjectURL(uploadedVideo.preview);
    }
    setUploadedVideo(null);
    setUploadProgress(0);
    clearFiles();
    onVideoRemove?.();
  }, [uploadedVideo, clearFiles, onVideoRemove]);

  const isUploading = uploadMutation.isPending || (uploadProgress > 0 && uploadProgress < 100);
  const hasVideo = uploadedVideo || existingVideoUrl;

  if (hasVideo) {
    return (
      <div className={cn('w-full', className)}>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="relative h-24 w-40 overflow-hidden rounded-lg border border-border bg-muted">
                <video
                  src={uploadedVideo?.preview || existingVideoUrl || undefined}
                  className="h-full w-full object-cover"
                  muted
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <VideoIcon className="size-8 text-white" />
                </div>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">
                      {uploadedVideo?.file.name || t('lessons.video.existingVideo')}
                    </p>
                    {uploadedVideo && (
                      <CheckCircle2Icon className="size-4 text-success" />
                    )}
                  </div>
                  {uploadedVideo && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatBytes(uploadedVideo.file.size)}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('lessons.video.duration')}: {formatDuration(uploadedVideo?.duration ?? existingDuration)}
                  </p>
                </div>

                {!disabled && (
                  <Button
                    type="button"
                    onClick={handleRemoveVideo}
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive"
                  >
                    <XIcon className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {isUploading ? (
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-6">
          <div className="flex flex-col items-center gap-3">
            <Loader2Icon className="size-8 text-muted-foreground animate-spin" />
            <div className="text-center">
              <p className="text-sm font-medium">{t('lessons.video.uploading')}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {uploadProgress < 50
                  ? t('lessons.video.extractingMetadata')
                  : t('lessons.video.uploadingToServer')
                }
              </p>
            </div>
            <Progress value={uploadProgress} className="h-1 w-full max-w-xs" />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'relative rounded-lg border border-dashed p-6 text-center transition-colors cursor-pointer',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
          onDragEnter={disabled ? undefined : handleDragEnter}
          onDragLeave={disabled ? undefined : handleDragLeave}
          onDragOver={disabled ? undefined : handleDragOver}
          onDrop={disabled ? undefined : handleDrop}
          onClick={disabled ? undefined : openFileDialog}
        >
          <input {...getInputProps()} className="sr-only" disabled={disabled} />

          <div className="flex flex-col items-center gap-3">
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full',
                isDragging ? 'bg-primary/10' : 'bg-muted',
              )}
            >
              <UploadIcon className={cn('size-5', isDragging ? 'text-primary' : 'text-muted-foreground')} />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">{t('lessons.video.uploadTitle')}</p>
              <p className="text-xs text-muted-foreground">
                {t('lessons.video.uploadDescription', { maxSize: formatBytes(maxSize) })}
              </p>
            </div>

            <Button type="button" size="sm" variant="outline" disabled={disabled}>
              <VideoIcon className="size-4" />
              {t('lessons.video.selectVideo')}
            </Button>
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <Alert variant="destructive" appearance="light" className="mt-3">
          <AlertIcon>
            <TriangleAlert />
          </AlertIcon>
          <AlertTitle className="text-xs">{errors[0]}</AlertTitle>
        </Alert>
      )}
    </div>
  );
}
