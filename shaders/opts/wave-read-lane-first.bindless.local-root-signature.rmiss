struct CBVData { float4 v; float4 w; };

ConstantBuffer<CBVData> SBTCBV : register(b3, space15);
ConstantBuffer<CBVData> SBTRootConstant : register(b0, space15);

struct Payload
{
	float4 color;
	int index;
};

[shader("miss")]
void RayMiss(inout Payload payload)
{
	// None of these should optimize, unsafe.
	payload.color += WaveReadLaneFirst(SBTRootConstant.v);
	payload.color += WaveReadLaneFirst(SBTCBV.v);
}
