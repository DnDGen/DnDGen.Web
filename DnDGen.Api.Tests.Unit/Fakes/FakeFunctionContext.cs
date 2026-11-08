using Microsoft.Azure.Functions.Worker;

namespace DnDGen.Api.Tests.Unit.Fakes
{
    public class FakeFunctionContext : FunctionContext
    {
        public override string InvocationId { get; } = null!;
        public override string FunctionId { get; } = null!;
        public override TraceContext TraceContext { get; } = null!;
        public override BindingContext BindingContext { get; } = null!;
        public override RetryContext RetryContext { get; } = null!;
        public override IServiceProvider InstanceServices { get; set; } = null!;
        public override FunctionDefinition FunctionDefinition { get; } = null!;
        public override IDictionary<object, object> Items { get; set; } = null!;
        public override IInvocationFeatures Features { get; } = null!;
    }
}
