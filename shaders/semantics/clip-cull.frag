struct PSIn
{
	float2 clip0 : SV_ClipDistance0;
	float clip1 : SV_ClipDistance1;
	float clip2 : SV_ClipDistance2;
	float2 cull0 : SV_CullDistance0;
	float cull1 : SV_CullDistance1;
};

float4 main(PSIn pin) : SV_Target
{
	float4 res = float4(pin.clip0, pin.clip1, pin.clip2);
	res += pin.cull0.xyxy;
	res += pin.cull1;
	return res;
}
