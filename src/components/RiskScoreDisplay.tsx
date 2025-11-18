/**
 * Risk Score Display Component
 */

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from '@mui/material';
import { RiskScore } from '../types/form';
import { getRiskLevelColor, getRiskLevelBgColor, getRiskLevelText } from '../utils/riskCalculation';

interface RiskScoreDisplayProps {
  riskScore: RiskScore;
  showBreakdown?: boolean;
  compact?: boolean;
}

/**
 * Risk Score Display Component
 * Shows total risk score, level, and section-wise breakdown
 */
export const RiskScoreDisplay: React.FC<RiskScoreDisplayProps> = ({
  riskScore,
  showBreakdown = true,
  compact = false,
}) => {
  const getRiskLevelChipColor = (
    level: 'Low' | 'Medium' | 'High' | 'Critical'
  ): 'success' | 'warning' | 'error' => {
    switch (level) {
      case 'Low':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'High':
      case 'Critical':
        return 'error';
      default:
        return 'success';
    }
  };

  if (compact) {
    return (
      <Card
        sx={{
          background: `linear-gradient(135deg, ${getRiskLevelBgColor(riskScore.level)} 0%, white 100%)`,
          borderLeft: `4px solid ${getRiskLevelColor(riskScore.level)}`,
        }}
      >
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography color="textSecondary" gutterBottom>
                Risk Score
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {riskScore.totalScore}
              </Typography>
            </Box>
            <Chip
              label={getRiskLevelText(riskScore.level)}
              color={getRiskLevelChipColor(riskScore.level)}
              variant="filled"
              sx={{ height: 32 }}
            />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        {/* Header with score and level */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography color="textSecondary" gutterBottom>
                Overall Risk Score
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: getRiskLevelColor(riskScore.level) }}>
                {riskScore.totalScore} / {riskScore.maxScore}
              </Typography>
            </Box>
            <Chip
              label={getRiskLevelText(riskScore.level)}
              color={getRiskLevelChipColor(riskScore.level)}
              variant="filled"
              size="medium"
              sx={{ height: 40 }}
            />
          </Box>

          {/* Progress bar */}
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="textSecondary">
                Score Progress
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {riskScore.percentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={riskScore.percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#f0f0f0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getRiskLevelColor(riskScore.level),
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        </Box>

        {/* Section breakdown */}
        {showBreakdown && Object.keys(riskScore.breakdown).length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Risk by Section
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Section</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Score
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Progress
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(riskScore.breakdown).map(([sectionId, item]) => {
                    const breakdown = item as any;
                    return (
                      <TableRow key={sectionId}>
                        <TableCell sx={{ textTransform: 'capitalize' }}>
                          {sectionId.replace(/-/g, ' ')}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title={`${breakdown.score} / ${breakdown.maxScore}`}>
                            <span>
                              {breakdown.score} / {breakdown.maxScore}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ flexGrow: 1, minWidth: 60 }}>
                              <LinearProgress
                                variant="determinate"
                                value={breakdown.percentage}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: '#e0e0e0',
                                }}
                              />
                            </Box>
                            <Typography variant="caption" sx={{ minWidth: 30 }}>
                              {Math.round(breakdown.percentage)}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Risk level explanation */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
            Risk Levels:
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption">
                <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: '#4caf50', borderRadius: '50%', marginRight: 4 }} />
                Low: 0-25
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption">
                <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: '#ff9800', borderRadius: '50%', marginRight: 4 }} />
                Medium: 25-50
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption">
                <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: '#f44336', borderRadius: '50%', marginRight: 4 }} />
                High: 50-75
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="caption">
                <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: '#b71c1c', borderRadius: '50%', marginRight: 4 }} />
                Critical: 75-100
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RiskScoreDisplay;
