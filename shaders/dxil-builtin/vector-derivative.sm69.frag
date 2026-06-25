float4 main(float4 uv : TEXCOORD) : SV_Target
{
	float2 uv_f = float2(uv.xy);
	float2 rx_f = ddx_coarse(uv_f);
	float2 ry_f = ddy_coarse(uv_f);
	rx_f += ddx_fine(uv_f);
	ry_f += ddy_fine(uv_f);

	half3 uv_h = half3(uv.xyz);
	half3 rx_h = ddx_coarse(uv_h);
	half3 ry_h = ddy_coarse(uv_h);
	rx_h += ddx_fine(uv_h);
	ry_h += ddy_fine(uv_h);

	double4 uv_d = double4(uv);
	double4 rx_d = ddx_coarse(uv_d);
	double4 ry_d = ddy_coarse(uv_d);
	rx_d += ddx_fine(uv_d);
	ry_d += ddy_fine(uv_d);

	return float4(rx_f, ry_f) + float4(rx_h + ry_h, 0.0) + float4(rx_d + rx_d);
}
