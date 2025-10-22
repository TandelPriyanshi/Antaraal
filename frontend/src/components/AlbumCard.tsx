import React from "react";
import { useNavigate } from "react-router-dom";

export type AlbumCardProps = {
  id: string;
  coverUrl?: string;
  title: string;
  photoCount: number;
  updatedAt?: string;
  tags?: string[];
  visibility?: "private" | "public";
  favorite?: boolean;
};

const AlbumCard: React.FC<AlbumCardProps> = ({ id, coverUrl, title, photoCount, updatedAt, tags, visibility }) => {
  const navigate = useNavigate();
  const dateText = updatedAt ? new Date(updatedAt).toLocaleDateString() : undefined;

  return (
    <div onClick={() => navigate(`/dashboard/albums/${id}`)} className="cursor-pointer group">
      <div className="aspect-video rounded-lg overflow-hidden bg-muted">
        {coverUrl ? (
          <img src={coverUrl} alt={title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xl">{title}</div>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between">
        {/* <h3 className="font-medium truncate">{title}</h3> */}
        <span className="text-lg text-muted-foreground">{photoCount} photos</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>{dateText ? `Updated ${dateText}` : ''}</span>
      </div>
      {tags && tags.length > 0 ? (
        <div className="mt-1 flex flex-wrap gap-1">
          {tags.slice(0, 3).map((t) => (
            <span key={t} className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-foreground">{t}</span>
          ))}
          {tags.length > 3 ? <span className="text-[10px] text-muted-foreground">+{tags.length - 3}</span> : null}
        </div>
      ) : null}
    </div>
  );
};

export default AlbumCard;