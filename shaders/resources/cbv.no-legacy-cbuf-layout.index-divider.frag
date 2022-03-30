cbuffer Cbuf
{
	float a[64];
	float2 b[64];
	float3 c[64];
	float4 d[64];
};

float4 main(nointerpolation uint index : INDEX) : SV_Target
{
	return a[index].xxxx + b[index].xyxy + c[index].xyzx + d[index];
}
