import React from 'react';

interface ComicBubbleProps {
  type?: 'speech' | 'thought' | 'shout';
  text: string;
  direction?: 'right' | 'left';
  className?: string;
  style?: React.CSSProperties;
}

export const ComicBubble: React.FC<ComicBubbleProps> = ({
  type = 'speech',
  text,
  direction = 'right',
  className = '',
  style,
}) => {
  const typeClass =
    type === 'speech'
      ? `comic-speech ${direction}-tail`
      : type === 'thought'
        ? 'comic-thought'
        : 'comic-shout';

  return (
    <div className={`${typeClass} ${className}`} style={style}>
      {text}
    </div>
  );
};
