export class XMLElement {
  private element: string;
  private attributes: Attributes[] = [];
  private content: string | null;
  private childs: XMLElement[] = [];
  private isSingleTag: boolean = false;

  constructor(element: string, attributes?: Attributes[], content?: string) {
    this.element = element;
    if (attributes) this.attributes = attributes;
    if (content) {
      this.isSingleTag = false;
      this.content = content;
    }
  }

  addChild(XMLElement: XMLElement) {
    this.childs.push(XMLElement);
    this.isSingleTag = false;
  }

  removeChild(XMLElement: XMLElement) {
    this.childs?.filter((child) => child != XMLElement);
  }

  removeAllChilds() {
    this.childs = [];
    this.isSingleTag = true;
  }

  addChilds(XMLElements: XMLElement[]) {
    this.childs.push(...XMLElements);
  }

  addAttribute(attribute: Attributes) {
    this.attributes.push(attribute);
  }

  removeAttribute(attribute: Attributes) {
    this.attributes.filter((attr) => attr != attribute);
  }

  removeAllAttributes() {
    this.attributes = [];
  }

  getAttributes() {
    return this.attributes;
  }

  getChildren() {
    return this.childs;
  }

  addAttributes(attributes: Attributes[]) {
    this.attributes.push(...attributes);
  }

  getXMLElement(): string {
    let attributes = "";
    if (this.attributes) {
      attributes = this.attributes.reduce(
        (acc, attr) => acc + `${attr.attribute}="${attr.value}"`,
        ""
      );
    }

    let childs = "";
    if (this.childs) {
      childs = this.childs.reduce(
        (acc, child) => acc + child.getXMLElement(),
        ""
      );
    }

    let startTag = `<${this.element} ${attributes}>`;
    let endTag = `</${this.element}>`;

    return this.isSingleTag
      ? startTag
      : startTag + (this.content ?? "") + childs + endTag;
  }
}
