Texture2D<float4> Input : register(t0, space1000);
Texture2D<int4> InputInt : register(t1, space1000);
Texture2D<uint4> InputUint : register(t2, space1000);
Texture2D<float> InputDepth : register(t3, space1001);
Texture2D<uint> InputStencil : register(t4, space1001);
Texture2DMS<float4> InputMS : register(t5, space1000);
Texture2DMS<float> InputDepthMS : register(t6, space1001);

float4 main(float4 pos : SV_Position, uint samp : SV_SampleIndex) : SV_Target
{
	float4 res = 0.0.xxxx;

	res += Input.Load(int3(pos.xy, 0));
	res += float4(InputInt.Load(int3(pos.xy, 0)));
	res += float4(InputUint.Load(int3(pos.xy, 0)));
	res += InputDepth.Load(int3(pos.xy, 0));
	res += float(InputStencil.Load(int3(pos.xy, 0)));

	res += InputMS.Load(int2(pos.xy), samp);
	res += InputDepthMS.Load(int2(pos.xy), samp);

	return res;
}
