static float global_array[4] = { 5, 6, 7, 8 };

[noinline] void bump2(out float x, float z, out float y)
{
	x = 4.0;
	y = 5.0;
	global_array[2] = 6.0 + z;
}

[noinline] void bump(inout float x)
{
	float2 o;
	bump2(o.x, 10.0, o.y);
	x += 1.0 + o.x + o.y;
}

float4 main(float v : TEXCOORD0) : SV_Target
{
	float local_array[4] = { 1, 2, 3, 4 };
	float a = v;
	bump(a);
	bump(local_array[int(v) & 3]);
	return a + local_array[0] + local_array[1] + global_array[int(v) & 3];
}
