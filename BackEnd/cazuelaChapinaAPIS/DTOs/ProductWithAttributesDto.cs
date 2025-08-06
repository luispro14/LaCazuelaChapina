namespace cazuelaChapinaAPIS.DTOs
{
    public class ProductAttributeValueOptionDto
    {
        public string Value { get; set; }
    }

    public class ProductAttributeDto
    {
        public int AttributeId { get; set; }
        public string AttributeName { get; set; }
        public List<string> Options { get; set; }
    }

    public class ProductWithAttributesDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public List<ProductAttributeDto> Attributes { get; set; }
    }
}
