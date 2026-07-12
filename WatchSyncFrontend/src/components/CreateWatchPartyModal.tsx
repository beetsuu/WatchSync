import { useState } from "react";
import { theme } from "../theme";

function CreateWatchPartyModal({
    onAdd,
    onClose
}: {
    onAdd: (name: string, turnLimit: number) => void,
    onClose: () => void
}) {

    const [name, setName] = useState('');
    const [turnLimitEnabled, setTurnLimitEnabled] = useState(false);
    const [turnLimit, setTurnLimit] = useState(0);

    function handleCreate() {
        onAdd(
            name,
            turnLimitEnabled ? turnLimit : 0
        );
        onClose();
    }
    return (

        <div
            className="flex flex-col gap-4 p-6 w-80"
            style={{
                backgroundColor: theme.card,
                borderRadius: theme.radius,
                border: `1px solid ${theme.border}`,
                alignItems: "center"
            }}
        >
            <h2 className="font-bold text-lg">
                Create Watch Party
            </h2>

            <p
                className="text-sm text-center opacity-70"
            >
                Watch Party lets people watch a show together by taking turns.
                You can optionally limit how many episodes each person watches per turn.
            </p>

            <input
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="px-3 py-2 rounded bg-black/30 outline-none w-full"
            />

            <div className="flex items-center justify-center gap-5">
                <label className="text-sm whitespace-nowrap">
                    Enable turn limit:
                </label>

                <input
                    type="checkbox"
                    checked={turnLimitEnabled}
                    onChange={e => setTurnLimitEnabled(e.target.checked)}
                />
            </div>

            {turnLimitEnabled && (
                <div className="w-full flex flex-col items-center">
                    <label className="text-sm opacity-70 mb-1">
                        Turn Limit
                    </label>

                    <input
                        type="number"
                        min={0}
                        placeholder="0 = unlimited"
                        value={turnLimit}
                        onChange={e =>
                            setTurnLimit(
                                e.target.value === ""
                                    ? 0
                                    : Number(e.target.value)
                            )
                        }
                        className="px-3 py-2 rounded bg-black/30 outline-none w-full"
                    />
                </div>
            )}

            <div className=" flex flex-col gap-2 w-full relative">
                <button
                    className="w-full sm:w-auto px-4 py-2 rounded font-bold"
                    style={{
                        backgroundColor: theme.accent,
                        color: theme.background
                    }}
                    onClick={handleCreate}
                >
                    Create
                </button>

                <button
                    className="w-full sm:w-auto px-4 py-2 rounded font-bold"
                    style={{
                        backgroundColor: theme.errorButton.backgroundColor,
                        color: theme.errorButton.color
                    }}
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>

        </div>

    )
}

export default CreateWatchPartyModal;