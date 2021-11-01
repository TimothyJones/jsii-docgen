import * as reflect from 'jsii-reflect';
import { Markdown } from '../render/markdown';
import { PropertySchema } from '../schema';
import { Transpile, TranspiledType } from '../transpile/transpile';
import { Property } from './property';

export class Properties {
  private readonly properties: Property[];
  constructor(transpile: Transpile, properties: reflect.Property[]) {
    this.properties = properties
      .filter((p) => !p.protected && !p.const)
      .map((p) => new Property(transpile, p));
  }

  public toMarkdown(linkFormatter: (type: TranspiledType) => string): Markdown {
    if (this.properties.length === 0) {
      return Markdown.EMPTY;
    }

    const md = new Markdown({ header: { title: 'Properties' } });
    for (const property of this.properties) {
      md.section(property.toMarkdown(linkFormatter));
    }
    return md;
  }

  public toJson(): PropertySchema[] {
    return this.properties.map((property) => property.toJson());
  }
}
