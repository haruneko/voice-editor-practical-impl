import uzumejs, { UzumeJs } from "uzumejs";

// Required to let webpack 4 know it needs to copy the wasm file to our assets
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import uzumejsWasm from "!!file-loader?name=uzumewasm-[contenthash].wasm!uzumejs/resources/uzumewasm.wasm";

let uzume: UzumeJs | null = null;

const useUzume = async () => {
  if (uzume) {
    return uzume;
  }
  uzume = await uzumejs({ locateFile: () => uzumejsWasm });
  return uzume;
};

export default useUzume;
