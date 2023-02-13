import Icon from "@components/Icon";
import { useTranslations } from "@hooks";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useRef, useState } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";

interface ActiveDownloadProps {
    id: string;
    progressAction: "Download" | "Extract" | "Wine";
    progressType: "Definite" | "Indefinite";
    message: string;
    progress: number;
    len: number;
}

interface ProgressIncrementPayload {
    increment: {
        id: string;
        amount: number;
    };
}

interface ProgressMessagePayload {
    changeMsg: {
        id: string;
        newMsg: string;
    };
}

interface ProgressFinishPayload {
    finish: {
        id: string;
        msg: string;
    };
}

const ActiveDownload = (props: ActiveDownloadProps) => {
    return (
        <div className={`downloads-row${props.progress >= props.len ? " download-done" : ""}`}>
            <p className="download-header fix-icons">
                <Icon iconType={FaCheck} /> {props.message}
            </p>
            <progress
                value={
                    props.progressType === "Indefinite" && props.progress === 0
                        ? undefined
                        : props.progress / props.len
                }
                max={1}
            />
        </div>
    );
};

const DownloadsPopout = () => {
    const [downloads, setDownloads] = useState<Record<string, ActiveDownloadProps>>({});

    const downloadsRef = useRef(downloads);

    useEffect(() => {
        downloadsRef.current = downloads;
    }, [downloads]);

    useEffect(() => {
        listen("PROGRESS-START", (p) => {
            const data = p.payload as ActiveDownloadProps;
            if (data.progressAction !== "Wine") {
                if (data.id in downloadsRef.current) {
                    delete downloadsRef.current[data.id];
                }
                setDownloads({ ...downloadsRef.current, [data.id]: { ...data, progress: 0 } });
            }
        }).catch(console.warn);
        listen("PROGRESS-INCREMENT", (e) => {
            const payload = (e.payload as ProgressIncrementPayload).increment;
            const current = downloadsRef.current[payload.id];
            if (current) {
                current.progress += payload.amount;
                setDownloads({ ...downloadsRef.current, [current.id]: current });
            }
        });
        listen("PROGRESS-MSG", (e) => {
            const payload = (e.payload as ProgressMessagePayload).changeMsg;
            const current = downloadsRef.current[payload.id];
            if (current) {
                current.message = payload.newMsg;
                setDownloads({ ...downloadsRef.current, [current.id]: current });
            }
        });
        listen("PROGRESS-FINISH", (e) => {
            const payload = (e.payload as ProgressFinishPayload).finish;
            const current = downloadsRef.current[payload.id];
            if (current && current.progressAction === "Extract") {
                current.message = payload.msg;
                if (current.progressType === "Indefinite") {
                    current.progress = 1;
                } else {
                    current.progress = current.len;
                }
                setDownloads({ ...downloadsRef.current, [current.id]: current });
            }
        });
    }, []);

    const [noDownloads, clearDownloads] = useTranslations(["NO_DOWNLOADS", "CLEAR_DOWNLOADS"]);

    return (
        <div className="downloads-popout">
            {Object.keys(downloads).length === 0 ? (
                <p className="no-downloads">{noDownloads}</p>
            ) : (
                <>
                    <a
                        href="#"
                        className="clear-downloads"
                        data-tooltip={clearDownloads}
                        data-placement="left"
                        onClick={() => setDownloads({})}
                    >
                        <Icon iconType={FaTrash} />
                    </a>
                    {Object.values(downloads)
                        .reverse()
                        .map((d) => (
                            <ActiveDownload key={d.id} {...d} />
                        ))}
                </>
            )}
        </div>
    );
};

export default DownloadsPopout;
