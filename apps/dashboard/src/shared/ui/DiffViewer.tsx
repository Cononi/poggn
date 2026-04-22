import { Box, Paper } from "@mui/material";

export function DiffViewer(props: { value: string }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 0,
        borderRadius: 1,
        maxHeight: "65vh",
        overflow: "auto",
        backgroundColor: "rgba(22, 19, 17, 0.96)"
      }}
    >
      <Box component="pre" sx={{ m: 0, p: 2, fontSize: "0.82rem", lineHeight: 1.7 }}>
        {props.value.split("\n").map((line, index) => {
          const backgroundColor = line.startsWith("+")
            ? "rgba(57, 179, 92, 0.16)"
            : line.startsWith("-")
              ? "rgba(248, 81, 73, 0.16)"
              : "transparent";
          const color = line.startsWith("@@")
            ? "#f2c55c"
            : line.startsWith("+")
              ? "#8bd49f"
              : line.startsWith("-")
                ? "#f2a2a2"
                : "#f7efe6";

          return (
            <Box
              key={`${index}:${line}`}
              component="div"
              sx={{
                px: 1.25,
                borderRadius: 1,
                backgroundColor,
                color,
                whiteSpace: "pre-wrap",
                fontFamily: '"IBM Plex Mono", "SFMono-Regular", monospace'
              }}
            >
              {line || " "}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
