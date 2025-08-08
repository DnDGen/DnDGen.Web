using DnDGen.Api.TreasureGen.Models.Legacy;
using DnDGen.TreasureGen.Items;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Abstractions;
using Microsoft.OpenApi.Models;

namespace DnDGen.Api.TreasureGen.Swagger
{
    public class ItemV1OneOfDocumentFilter : IDocumentFilter
    {
        public void Apply(IHttpRequestDataObject req, OpenApiDocument swaggerDoc)
        {
            var path = "/v1/item/{itemType}/power/{power}/generate";
            if (!swaggerDoc.Paths.ContainsKey(path))
                return;

            var operation = swaggerDoc.Paths[path].Operations[OperationType.Get];

            // Reference existing schemas by name
            var itemSchema = new OpenApiSchema { Reference = new OpenApiReference { Type = ReferenceType.Schema, Id = nameof(Item) } };
            var weaponSchema = new OpenApiSchema { Reference = new OpenApiReference { Type = ReferenceType.Schema, Id = nameof(WeaponV1) } };
            var armorSchema = new OpenApiSchema { Reference = new OpenApiReference { Type = ReferenceType.Schema, Id = nameof(Armor) } };

            var oneOfSchema = new OpenApiSchema
            {
                OneOf = [itemSchema, weaponSchema, armorSchema]
            };

            if (operation.Responses.ContainsKey("200") &&
                operation.Responses["200"].Content.ContainsKey("application/json"))
            {
                operation.Responses["200"].Content["application/json"].Schema = oneOfSchema;
            }
        }
    }
}