import { useEffect, useRef } from 'react';

const HealthChart = ({ domains = [] }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || domains.length === 0) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Chart configuration
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const maxValue = 100;

        // Draw grid lines
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Draw Y-axis labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        for (let i = 0; i <= 5; i++) {
            const value = maxValue - (maxValue / 5) * i;
            const y = padding + (chartHeight / 5) * i;
            ctx.fillText(value.toString(), 5, y + 4);
        }

        // Prepare data points
        const dataPoints = domains.map((domain, index) => ({
            x: padding + (chartWidth / (domains.length - 1)) * index,
            y: padding + chartHeight - (domain.healthScore / maxValue) * chartHeight,
            value: domain.healthScore,
            name: domain.name
        }));

        // Draw line
        if (dataPoints.length > 1) {
            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(dataPoints[0].x, dataPoints[0].y);

            for (let i = 1; i < dataPoints.length; i++) {
                ctx.lineTo(dataPoints[i].x, dataPoints[i].y);
            }
            ctx.stroke();
        }

        // Draw data points
        dataPoints.forEach((point, index) => {
            // Point background
            ctx.fillStyle = point.value >= 80 ? '#10b981' : point.value >= 60 ? '#f59e0b' : '#ef4444';
            ctx.beginPath();
            ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
            ctx.fill();

            // Point border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Domain name labels
            ctx.fillStyle = '#374151';
            ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(point.name, point.x, height - 10);
        });

        // Draw X-axis
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

    }, [domains]);

    if (domains.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-gray-500">No data to display</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Score Trend</h3>
            <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="w-full h-48"
            />
            <div className="mt-4 flex justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Healthy (80+)</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">Warning (60-79)</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">Critical (&lt;60)</span>
                </div>
            </div>
        </div>
    );
};

export default HealthChart;
