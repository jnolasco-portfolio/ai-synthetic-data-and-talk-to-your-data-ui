import './LoadingOverlay.css';

interface LoadingOverlayProps {
  /**
   * The message to display to the user.
   */
  message: string;
  /**
   * The current progress value (0-100). If provided, a progress bar is shown.
   */
  progress?: number;
}

const LoadingOverlay = ({ message, progress }: LoadingOverlayProps) => {
  return (
    <dialog open className='overlay-container'>
      <article className='overlay-content'>
        <span aria-busy='true'>{message}</span>
        {progress !== undefined && progress > 0 && (
          <progress value={progress} max='100'></progress>
        )}
      </article>
    </dialog>
  );
};

export default LoadingOverlay;
