export type CsvCell = string | number | null | undefined

export function downloadCsv(fileName: string, rows: readonly (readonly CsvCell[])[]) {
  if (typeof window === "undefined") return

  const csv = rows
    .map((row) =>
      row
        .map((value) => {
          const cell = String(value ?? "")
          return /[",\r\n]/.test(cell) ? `"${cell.replaceAll('"', '""')}"` : cell
        })
        .join(","),
    )
    .join("\r\n")
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" })
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement("a")

  anchor.href = objectUrl
  anchor.download = fileName
  anchor.hidden = true
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}
