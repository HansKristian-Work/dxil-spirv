float4 main(float2 UV : TEXCOORD) : SV_Target
{
	float4 r = 0.0.xxxx;
	r.xy += ddx_coarse(UV);
	r.zw += ddy_coarse(UV);
	r.xy += ddx_fine(UV);
	r.zw += ddy_fine(UV);

	min16float2 UV_h = min16float2(UV);
	r.xy += float2(ddx_coarse(UV_h));
	r.zw += float2(ddy_coarse(UV_h));
	r.xy += float2(ddx_fine(UV_h));
	r.zw += float2(ddy_fine(UV_h));

	return r;
}
