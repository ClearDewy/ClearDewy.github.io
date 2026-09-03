const PYODIDE_BASE_URL = "https://cdn.jsdelivr.net/pyodide/v314.0.6/full/";

export const DEFAULT_PYTHON_PACKAGES = [
  "numpy",
  "pandas",
  "scipy",
  "matplotlib",
  "scikit-learn",
  "xgboost",
  "lightgbm",
] as const;

type PyodideRuntime = any;

let runtimePromise: Promise<PyodideRuntime> | undefined;
let packageLoadQueue: Promise<void> = Promise.resolve();
const loadedPackages = new Set<string>(DEFAULT_PYTHON_PACKAGES);

export function loadPythonRuntime(): Promise<PyodideRuntime> {
  if (!runtimePromise) {
    const moduleUrl = `${PYODIDE_BASE_URL}pyodide.mjs`;
    runtimePromise = import(/* @vite-ignore */ moduleUrl).then(({ loadPyodide }) =>
      loadPyodide({
        indexURL: PYODIDE_BASE_URL,
        packages: [...DEFAULT_PYTHON_PACKAGES],
      }),
    );
  }

  return runtimePromise;
}

export async function ensurePythonPackages(packages: readonly string[] = []) {
  const requestedPackages = [...new Set(packages.map((name) => name.trim()).filter(Boolean))];
  const loadOperation = packageLoadQueue.then(async () => {
    const missingPackages = requestedPackages.filter((name) => !loadedPackages.has(name));
    if (!missingPackages.length) return;

    const runtime = await loadPythonRuntime();
    await runtime.loadPackage(missingPackages);
    missingPackages.forEach((name) => loadedPackages.add(name));
  });

  // A failed optional package must not permanently poison later package loads.
  packageLoadQueue = loadOperation.catch(() => undefined);
  await loadOperation;

  return loadPythonRuntime();
}
