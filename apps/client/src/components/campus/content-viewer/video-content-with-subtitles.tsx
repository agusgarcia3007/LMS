import { useState, useMemo } from "react";
import { VideoContent, type SubtitleTrack } from "./video-content";
import { useSubtitleVtt } from "@/services/subtitles/queries";

type AvailableSubtitle = {
  language: string;
  label: string;
};

type VideoContentWithSubtitlesProps = {
  videoId: string;
  src: string;
  poster?: string;
  initialTime?: number;
  availableSubtitles: AvailableSubtitle[];
  defaultSubtitleLang?: string;
  onComplete?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onPause?: (currentTime: number) => void;
  onSeeked?: (currentTime: number) => void;
  onVideoRefReady?: (ref: HTMLVideoElement | null) => void;
  className?: string;
};

export function VideoContentWithSubtitles({
  videoId,
  availableSubtitles,
  defaultSubtitleLang,
  ...props
}: VideoContentWithSubtitlesProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
    defaultSubtitleLang || null
  );

  const { data: vttData, isLoading: isLoadingVtt } = useSubtitleVtt(
    videoId,
    selectedLanguage
  );

  const loadedSubtitle: SubtitleTrack | null = useMemo(() => {
    if (!selectedLanguage || !vttData?.vttUrl) return null;

    const track = availableSubtitles.find(
      (s) => s.language === selectedLanguage
    );
    if (!track) return null;

    return {
      language: track.language,
      label: track.label,
      vttUrl: vttData.vttUrl,
    };
  }, [selectedLanguage, vttData?.vttUrl, availableSubtitles]);

  const handleSubtitleSelect = (language: string | null) => {
    setSelectedLanguage(language);
  };

  return (
    <VideoContent
      {...props}
      availableSubtitles={availableSubtitles}
      loadedSubtitle={loadedSubtitle}
      isLoadingSubtitle={isLoadingVtt}
      onSubtitleSelect={handleSubtitleSelect}
      selectedSubtitleLang={selectedLanguage}
    />
  );
}
