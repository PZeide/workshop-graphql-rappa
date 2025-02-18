import connectionFailed from "../../assets/connection-failed.gif";

type ConnectionFailedModalProps = {
  message: string;
  shouldClose: () => void;
};

const ConnectionFailedModal = ({
  message,
  shouldClose,
}: ConnectionFailedModalProps) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50"
      onClick={() => shouldClose()}
    >
      <div
        className="relative rounded-lg bg-white p-8 text-center shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={connectionFailed} alt="error-gif" className="mx-auto mb-4" />
        <p className="mb-4 text-lg font-bold text-gray-800">{message}</p>
        <button
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          onClick={() => shouldClose()}
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default ConnectionFailedModal;
