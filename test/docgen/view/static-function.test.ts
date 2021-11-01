import * as reflect from 'jsii-reflect';
import { CSharpTranspile } from '../../../src/docgen/transpile/csharp';
import { JavaTranspile } from '../../../src/docgen/transpile/java';
import { PythonTranspile } from '../../../src/docgen/transpile/python';
import { TranspiledType } from '../../../src/docgen/transpile/transpile';
import { TypeScriptTranspile } from '../../../src/docgen/transpile/typescript';
import { StaticFunction } from '../../../src/docgen/view/static-function';
import { Assemblies } from '../assemblies';

const assembly: reflect.Assembly = Assemblies.instance.withoutSubmodules;

const findStaticFunction = (): reflect.Method => {
  for (const klass of assembly.system.classes) {
    for (const method of klass.ownMethods) {
      if (method.static) {
        return method;
      }
    }
  }
  throw new Error('Assembly does not contain a static function');
};

describe('python', () => {
  const transpile = new PythonTranspile();
  test('markdown snapshot', () => {
    const staticFunction = new StaticFunction(transpile, findStaticFunction());
    expect(staticFunction.toMarkdown((t: TranspiledType) => `#${t.fqn}`).render()).toMatchSnapshot();
  });

  test('json snapshot', () => {
    const staticFunction = new StaticFunction(transpile, findStaticFunction());
    expect(staticFunction.toJson()).toMatchSnapshot();
  });
});

describe('typescript', () => {
  const transpile = new TypeScriptTranspile();
  test('markdown snapshot', () => {
    const staticFunction = new StaticFunction(transpile, findStaticFunction());
    expect(staticFunction.toMarkdown((t: TranspiledType) => `#${t.fqn}`).render()).toMatchSnapshot();
  });

  test('json snapshot', () => {
    const staticFunction = new StaticFunction(transpile, findStaticFunction());
    expect(staticFunction.toJson()).toMatchSnapshot();
  });
});

describe('java', () => {
  const transpile = new JavaTranspile();
  test('markdown snapshot', () => {
    const staticFunction = new StaticFunction(transpile, findStaticFunction());
    expect(staticFunction.toMarkdown((t: TranspiledType) => `#${t.fqn}`).render()).toMatchSnapshot();
  });

  test('json snapshot', () => {
    const staticFunction = new StaticFunction(transpile, findStaticFunction());
    expect(staticFunction.toJson()).toMatchSnapshot();
  });
});

describe('csharp', () => {
  const transpile = new CSharpTranspile();
  test('markdown snapshot', () => {
    const staticFunction = new StaticFunction(transpile, findStaticFunction());
    expect(staticFunction.toMarkdown((t: TranspiledType) => `#${t.fqn}`).render()).toMatchSnapshot();
  });

  test('json snapshot', () => {
    const staticFunction = new StaticFunction(transpile, findStaticFunction());
    expect(staticFunction.toJson()).toMatchSnapshot();
  });
});
