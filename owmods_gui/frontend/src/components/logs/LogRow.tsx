import { hooks } from "@commands";
import ODTooltip from "@components/common/ODTooltip";
import StyledErrorBoundary from "@components/common/StyledErrorBoundary";
import { Box, Chip, Palette, Skeleton, TableCell, Typography, useTheme } from "@mui/material";
import { LogLineCountUpdatePayload, SocketMessageType } from "@types";
import { Fragment, memo, useLayoutEffect, useMemo } from "react";

export interface LogRowProps {
    port: number;
    index: number;
    onLoad: () => void;
}

const getColor = (palette: Palette, messageType: SocketMessageType) => {
    switch (messageType) {
        case SocketMessageType.Info:
            return palette.info.light;
        case SocketMessageType.Success:
            return palette.success.light;
        case SocketMessageType.Warning:
            return palette.warning.light;
        case SocketMessageType.Error:
        case SocketMessageType.Fatal:
            return palette.error.light;
        case SocketMessageType.Debug:
            return palette.grey[800];
        default:
            return palette.text.primary;
    }
};

const InnerLogRow = memo(function LogRow(props: LogRowProps) {
    const theme = useTheme();

    const [status, logLine] = hooks.getLogLine(
        "logLineCountUpdate",
        {
            port: props.port,
            line: props.index
        },
        (params) => {
            return (params as LogLineCountUpdatePayload).line === props.index;
        }
    );

    const messageType = useMemo(() => {
        return Object.values(SocketMessageType)[
            (logLine?.message.messageType as unknown as number) ?? 0
        ] as SocketMessageType;
    }, [logLine?.message.messageType]);

    const cellStyle = {
        backgroundColor: theme.palette.grey[900],
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    };

    const messageLines = useMemo(
        () => (logLine?.message.message ?? "").split("\n"),
        [logLine?.message.message]
    );

    const onLoad = props.onLoad;

    useLayoutEffect(() => {
        onLoad();
    }, [status, onLoad]);

    return (
        <>
            <TableCell sx={cellStyle}>
                {status === "Loading" && logLine === null ? (
                    <Skeleton width={50} />
                ) : (
                    <ODTooltip
                        title={`${logLine?.message.senderName ?? "Unknown"}::${
                            logLine?.message.senderType ?? "Unknown"
                        }\n${logLine?.timestamp ?? ""}`}
                    >
                        <Typography
                            className="senderName"
                            textOverflow="ellipsis"
                            width="100%"
                            overflow="hidden"
                        >
                            {logLine?.message.senderName ?? "Unknown"}
                        </Typography>
                    </ODTooltip>
                )}
            </TableCell>
            <TableCell sx={cellStyle}>
                <Box display="flex">
                    <Box flexGrow={1} sx={{ wordBreak: "break-all" }}>
                        {status === "Loading" && logLine === null ? (
                            <>
                                <Skeleton width={150} />
                                <Skeleton width={102} />
                            </>
                        ) : (
                            <Typography
                                whiteSpace="pre-wrap"
                                minWidth={0}
                                color={getColor(theme.palette, messageType)}
                            >
                                {messageLines.map((line, i) => (
                                    <Fragment key={`${i}-${line}`}>
                                        {line}
                                        {i !== messageLines.length - 1 && <br />}
                                    </Fragment>
                                ))}
                            </Typography>
                        )}{" "}
                    </Box>
                    {(logLine?.amount ?? 1) > 1 && (
                        <Box justifySelf="end">
                            <Chip
                                color={logLine?.amount === 4294967295 ? "error" : "default"}
                                size="small"
                                label={`x${logLine?.amount}`}
                            />
                        </Box>
                    )}
                </Box>
            </TableCell>
        </>
    );
});

const LogRow = memo(function LogRow(props: LogRowProps) {
    return (
        <StyledErrorBoundary justHide>
            <InnerLogRow {...props} />
        </StyledErrorBoundary>
    );
});

export default LogRow;
