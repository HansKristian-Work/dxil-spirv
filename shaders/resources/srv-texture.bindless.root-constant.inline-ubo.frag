Texture2D<float4> uTex : register(t3);
Texture2D<float4> uTexArray[64] : register(t4);
Texture2D<float4> uTexBindless[] : register(t100);

cbuffer CBUFFER : register(b0)
{
	uint index;
};

float4 main(float4 pos : SV_Position, nointerpolation uint dynamic_index : INDEX) : SV_Target
{
	int3 coord = int3(pos.xy, 0);
	float4 result = uTex.Load(coord);
	result += uTexArray[index].Load(coord);
	result += uTexBindless[NonUniformResourceIndex(dynamic_index)].Load(coord);
	result += uTexBindless[1].Load(coord);
	return result;
}
