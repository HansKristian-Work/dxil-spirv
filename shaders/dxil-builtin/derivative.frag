float4 main(float2 UV : TEXCOORD) : SV_Target
{
	float4 r = 0.0.xxxx;
	r.xy += ddx_coarse(UV);
	r.zw += ddy_coarse(UV);
	r.xy += ddx_fine(UV);
	r.zw += ddy_fine(UV);
	return r;
}
