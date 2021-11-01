import * as child from 'child_process';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import { Language, Documentation, TranspiledType } from '../../../src';
import { extractPackageName } from '../../../src/docgen/view/documentation';
import { Assemblies } from '../assemblies';

const LIBRARIES = `${__dirname}/../../__fixtures__/libraries`;

// this is a little concerning...we should be mindful
// if need to keep increasing this.
jest.setTimeout(120 * 1000);


describe('extractPackageName', () => {

  test('scope only', () => {
    expect(extractPackageName('@aws-cdk/aws-ecr')).toEqual('@aws-cdk/aws-ecr');
  });

  test('scope and version', () => {
    expect(extractPackageName('@aws-cdk/aws-ecr@1.100.1')).toEqual('@aws-cdk/aws-ecr');
  });

  test('no scope no version', () => {
    expect(extractPackageName('aws-cdk-lib')).toEqual('aws-cdk-lib');
  });

  test('version only', () => {
    expect(extractPackageName('aws-cdk-lib@1.100.1')).toEqual('aws-cdk-lib');
  });

});

test('custom link formatter', async () => {
  const docs = await Documentation.forPackage('@aws-cdk/aws-ecr@1.106.0', {
    language: Language.PYTHON,
  });
  const markdown = docs.toMarkdown({ linkFormatter: (t: TranspiledType) => `#custom-${t.fqn}` });
  expect(markdown.render()).toMatchSnapshot();
});

test('package installation does not run lifecycle hooks', async () => {

  const workdir = await fs.mkdtemp(path.join(os.tmpdir(), path.sep));
  const libraryName = 'construct-library';
  const libraryDir = path.join(LIBRARIES, libraryName);

  await fs.copy(libraryDir, workdir);

  const manifestPath = path.join(workdir, 'package.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));

  // inject a postinstall hook
  manifest.scripts.postinstall = 'exit 1';
  await fs.writeFile(manifestPath, JSON.stringify(manifest));

  // create the package
  child.execSync('yarn package', { cwd: workdir });

  // this should succeed because the failure script should be ignored
  const docs = await Documentation.forPackage(path.join(workdir, 'dist', 'js', `${libraryName}@0.0.0.jsii.tgz`), { name: libraryName });
  const markdown = docs.toMarkdown();
  expect(markdown.render()).toMatchSnapshot();
});

describe('python', () => {
  test('for package', async () => {
    const docs = await Documentation.forPackage('@aws-cdk/aws-ecr@1.106.0', {
      language: Language.PYTHON,
    });
    const markdown = docs.toMarkdown();
    expect(markdown.render()).toMatchSnapshot();
  });

  test('markdown snapshot - root module', async () => {
    const docs = await Documentation.forAssembly('@aws-cdk/aws-ecr', Assemblies.AWSCDK_1_106_0, {
      language: Language.PYTHON,
    });
    const markdown = docs.toMarkdown();
    expect(markdown.render()).toMatchSnapshot();
  });

  test('markdown snapshot - submodules', async () => {
    const docs = await Documentation.forAssembly('aws-cdk-lib', Assemblies.AWSCDK_1_106_0, {
      language: Language.PYTHON,
    });
    const markdown = docs.toMarkdown({ submodule: 'aws_eks' });
    expect(markdown.render()).toMatchSnapshot();
  });

  test('json snapshot - root module', async () => {
    const docs = await Documentation.forAssembly('@aws-cdk/aws-ecr', Assemblies.AWSCDK_1_106_0, {
      language: Language.PYTHON,
    });
    const json = docs.toJson();
    expect(json.render()).toMatchSnapshot();
  });

  test('json snapshot - submodules', async () => {
    const docs = await Documentation.forAssembly('aws-cdk-lib', Assemblies.AWSCDK_1_106_0, {
      language: Language.PYTHON,
    });
    const json = docs.toJson({ submodule: 'aws_eks' });
    expect(json.render()).toMatchSnapshot();
  });
});

describe('typescript', () => {
  test('for package', async () => {
    const docs = await Documentation.forPackage('@aws-cdk/aws-ecr@1.106.0');
    const markdown = docs.toMarkdown();
    expect(markdown.render()).toMatchSnapshot();
  });

  test('markdown snapshot - single module', async () => {
    const docs = await Documentation.forAssembly('@aws-cdk/aws-ecr', Assemblies.AWSCDK_1_106_0);
    const markdown = docs.toMarkdown();
    expect(markdown.render()).toMatchSnapshot();
  });

  test('markdown snapshot - submodules', async () => {
    const docs = await Documentation.forAssembly('aws-cdk-lib', Assemblies.AWSCDK_1_106_0);
    const markdown = docs.toMarkdown({ submodule: 'aws_eks' });
    expect(markdown.render()).toMatchSnapshot();
  });

  test('json snapshot - single module', async () => {
    const docs = await Documentation.forAssembly('@aws-cdk/aws-ecr', Assemblies.AWSCDK_1_106_0);
    const json = docs.toJson();
    expect(json.render()).toMatchSnapshot();
  });

  test('json snapshot - submodules', async () => {
    const docs = await Documentation.forAssembly('aws-cdk-lib', Assemblies.AWSCDK_1_106_0);
    const json = docs.toJson({ submodule: 'aws_eks' });
    expect(json.render()).toMatchSnapshot();
  });
});

describe('java', () => {
  test('for package', async () => {
    const docs = await Documentation.forPackage('@aws-cdk/aws-ecr@1.106.0', {
      language: Language.JAVA,
    });
    const markdown = docs.toMarkdown();
    expect(markdown.render()).toMatchSnapshot();
  });

  test('markdown snapshot - root module', async () => {
    const docs = await Documentation.forAssembly('@aws-cdk/aws-ecr', Assemblies.AWSCDK_1_106_0, {
      language: Language.JAVA,
    });
    const markdown = docs.toMarkdown();
    expect(markdown.render()).toMatchSnapshot();
  });

  test('markdown snapshot - submodules', async () => {
    const docs = await Documentation.forAssembly('aws-cdk-lib', Assemblies.AWSCDK_1_106_0, {
      language: Language.JAVA,
    });
    const markdown = docs.toMarkdown({ submodule: 'aws_eks' });
    expect(markdown.render()).toMatchSnapshot();
  });

  test('markdown snapshot - submodules 2', async () => {
    const docs = await Documentation.forAssembly('monocdk', Assemblies.AWSCDK_1_106_0, {
      language: Language.JAVA,
    });
    const markdown = docs.toMarkdown({ submodule: 'aws_eks' });
    expect(markdown.render()).toMatchSnapshot();
  });

  test('json snapshot - root module', async () => {
    const docs = await Documentation.forAssembly('@aws-cdk/aws-ecr', Assemblies.AWSCDK_1_106_0, {
      language: Language.JAVA,
    });
    const json = docs.toJson();
    expect(json.render()).toMatchSnapshot();
  });

  test('Json snapshot - submodules', async () => {
    const docs = await Documentation.forAssembly('aws-cdk-lib', Assemblies.AWSCDK_1_106_0, {
      language: Language.JAVA,
    });
    const json = docs.toJson({ submodule: 'aws_eks' });
    expect(json.render()).toMatchSnapshot();
  });

  test('json snapshot - submodules 2', async () => {
    const docs = await Documentation.forAssembly('monocdk', Assemblies.AWSCDK_1_106_0, {
      language: Language.JAVA,
    });
    const json = docs.toJson({ submodule: 'aws_eks' });
    expect(json.render()).toMatchSnapshot();
  });
});

describe('csharp', () => {
  test('for package', async () => {
    const docs = await Documentation.forPackage('@aws-cdk/aws-ecr@1.106.0', {
      language: Language.CSHARP,
    });
    const markdown = docs.toMarkdown();
    expect(markdown.render()).toMatchSnapshot();
  });

  test('markdown snapshot - root module', async () => {
    const docs = await Documentation.forAssembly('@aws-cdk/aws-ecr', Assemblies.AWSCDK_1_106_0, {
      language: Language.CSHARP,
    });
    const markdown = docs.toMarkdown();
    expect(markdown.render()).toMatchSnapshot();
  });

  test('markdown snapshot - submodules', async () => {
    const docs = await Documentation.forAssembly('aws-cdk-lib', Assemblies.AWSCDK_1_106_0, {
      language: Language.CSHARP,
    });
    const markdown = docs.toMarkdown({ submodule: 'aws_eks' });
    expect(markdown.render()).toMatchSnapshot();
  });

  test('markdown snapshot - submodules 2', async () => {
    const docs = await Documentation.forAssembly('monocdk', Assemblies.AWSCDK_1_106_0, {
      language: Language.CSHARP,
    });
    const markdown = docs.toMarkdown({ submodule: 'aws_eks' });
    expect(markdown.render()).toMatchSnapshot();
  });

  test('json snapshot - root module', async () => {
    const docs = await Documentation.forAssembly('@aws-cdk/aws-ecr', Assemblies.AWSCDK_1_106_0, {
      language: Language.CSHARP,
    });
    const json = docs.toJson();
    expect(json.render()).toMatchSnapshot();
  });

  test('json snapshot - submodules', async () => {
    const docs = await Documentation.forAssembly('aws-cdk-lib', Assemblies.AWSCDK_1_106_0, {
      language: Language.CSHARP,
    });
    const json = docs.toJson({ submodule: 'aws_eks' });
    expect(json.render()).toMatchSnapshot();
  });

  test('json snapshot - submodules 2', async () => {
    const docs = await Documentation.forAssembly('monocdk', Assemblies.AWSCDK_1_106_0, {
      language: Language.CSHARP,
    });
    const json = docs.toJson({ submodule: 'aws_eks' });
    expect(json.render()).toMatchSnapshot();
  });
});
