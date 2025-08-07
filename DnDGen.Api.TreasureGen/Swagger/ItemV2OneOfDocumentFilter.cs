using DnDGen.TreasureGen.Items;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Abstractions;
using Microsoft.OpenApi.Models;
using System.Collections.Generic;

namespace DnDGen.Api.TreasureGen.Swagger
{
    public class ItemV2OneOfDocumentFilter : IDocumentFilter
    {
        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {
            var path = "/v2/item/{itemType}/power/{power}/generate";
            var operation = swaggerDoc.Paths[path].Operations[OperationType.Get];

            var itemSchema = context.SchemaGenerator.GenerateSchema(typeof(Item), context.SchemaRepository);
            var weaponSchema = context.SchemaGenerator.GenerateSchema(typeof(Weapon), context.SchemaRepository);
            var armorSchema = context.SchemaGenerator.GenerateSchema(typeof(Armor), context.SchemaRepository);

            var oneOfSchema = new OpenApiSchema
            {
                OneOf = new List<OpenApiSchema> { itemSchema, weaponSchema, armorSchema }
            };

            operation.Responses["200"].Content["application/json"].Schema = oneOfSchema;
        }
    }
}
