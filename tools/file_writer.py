from pathlib import Path


class FileWriterTool:
    """
    A safe file writer tool for generated project files.

    It writes files only inside the configured base_dir to prevent unsafe
    paths like ../../somewhere/outside/project.
    """

    def __init__(self, base_dir="generated_project"):
        self.base_dir = Path(base_dir).resolve()
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def _safe_path(self, relative_path: str) -> Path:
        """
        Convert a relative path into a safe absolute path inside base_dir.
        """

        if not relative_path:
            raise ValueError("relative_path cannot be empty")

        target_path = (self.base_dir / relative_path).resolve()

        # Ensure the target stays inside base_dir
        try:
            target_path.relative_to(self.base_dir)
        except ValueError:
            raise ValueError(f"Unsafe path detected: {relative_path}")

        return target_path

    def write_file(self, relative_path: str, content: str) -> dict:
        """
        Write content to a file inside base_dir.

        Example:
            write_file(
                relative_path="backend/src/server.js",
                content="console.log('server')"
            )
        """

        target_path = self._safe_path(relative_path)
        target_path.parent.mkdir(parents=True, exist_ok=True)
        target_path.write_text(content, encoding="utf-8")

        return {
            "path": str(target_path),
            "relative_path": relative_path,
            "status": "written",
        }

    def read_file(self, relative_path: str) -> str:
        """
        Read file content from inside base_dir.
        """

        target_path = self._safe_path(relative_path)

        if not target_path.exists():
            raise FileNotFoundError(f"File not found: {relative_path}")

        if not target_path.is_file():
            raise IsADirectoryError(f"Path is not a file: {relative_path}")

        return target_path.read_text(encoding="utf-8")

    def file_exists(self, relative_path: str) -> bool:
        """
        Check if a file exists inside base_dir.
        """

        target_path = self._safe_path(relative_path)
        return target_path.is_file()

    def list_files(self, relative_dir: str = "") -> list:
        """
        List all files inside a directory under base_dir.
        """

        target_dir = self._safe_path(relative_dir)

        if not target_dir.exists():
            return []

        if not target_dir.is_dir():
            return []

        files = []

        for path in target_dir.rglob("*"):
            if path.is_file():
                files.append(str(path.relative_to(self.base_dir)))

        return files

