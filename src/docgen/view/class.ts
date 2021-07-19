import * as reflect from 'jsii-reflect';
import { Markdown } from '../render/markdown';
import { ClassSchema } from '../schema';
import { Transpile, TranspiledClass, TranspiledType } from '../transpile/transpile';
import { Constants } from './constants';
import { Initializer } from './initializer';
import { InstanceMethods } from './instance-methods';
import { Properties } from './properties';
import { StaticFunctions } from './static-functions';

const CONSTRUCT_CLASS = 'constructs.Construct';

export class Class {
  public static isConstruct(klass: reflect.ClassType): boolean {
    if (klass.fqn === CONSTRUCT_CLASS) return true;

    if (!klass.base) {
      return false;
    }

    return this.isConstruct(klass.base);
  }

  private readonly transpiled: TranspiledClass;

  private readonly initializer?: Initializer;
  private readonly instanceMethods: InstanceMethods;
  private readonly staticFunctions: StaticFunctions;
  private readonly constants: Constants;
  private readonly properties: Properties;

  constructor(
    private readonly transpile: Transpile,
    private readonly klass: reflect.ClassType,
    private readonly linkFormatter: (type: TranspiledType) => string,
  ) {
    if (klass.initializer) {
      this.initializer = new Initializer(transpile, klass.initializer, linkFormatter);
    }
    this.instanceMethods = new InstanceMethods(transpile, klass.ownMethods, linkFormatter);
    this.staticFunctions = new StaticFunctions(transpile, klass.ownMethods, linkFormatter);
    this.constants = new Constants(transpile, klass.ownProperties, linkFormatter);
    this.properties = new Properties(transpile, klass.ownProperties, linkFormatter);
    this.transpiled = transpile.class(klass);
  }

  public toMarkdown(): Markdown {
    const md = new Markdown({
      id: this.transpiled.type.fqn,
      header: { title: this.transpiled.name },
    });

    if (this.klass.interfaces.length > 0) {
      const ifaces = [];
      for (const iface of this.klass.interfaces) {
        const transpiled = this.transpile.type(iface);
        ifaces.push(`[${Markdown.pre(transpiled.fqn)}](${this.linkFormatter(transpiled)})`);
      }
      md.bullet(`${Markdown.italic('Implements:')} ${ifaces.join(', ')}`);
      md.lines('');
    }

    if (this.klass.docs) {
      md.docs(this.klass.docs);
    }

    if (this.initializer) {
      md.section(this.initializer.toMarkdown());
    }
    md.section(this.instanceMethods.toMarkdown());
    md.section(this.staticFunctions.toMarkdown());
    md.section(this.properties.toMarkdown());
    md.section(this.constants.toMarkdown());
    return md;
  }

  public toJson(): ClassSchema {
    return {
      id: this.transpiled.type.fqn,
      name: this.transpiled.name,
      interfaces: this.klass.interfaces.map((iface) => {
        const transpiled = this.transpile.type(iface);
        return {
          fqn: iface.fqn,
          name: transpiled.fqn,
        };
      }),
      docs: this.klass.docs.toString(),
      initializer: this.initializer?.toJson(),
      instanceMethods: this.instanceMethods.toJson(),
      staticFunctions: this.staticFunctions.toJson(),
      properties: this.properties.toJson(),
      constants: this.constants.toJson(),
    };
  }
}
